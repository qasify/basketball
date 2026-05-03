"use client";

import { useEffect, useState } from "react";
import { Player } from "@/_api/basketball-api";
import { generateScoutingReport, extendScoutingReportWithPrompt, ScoutingReport } from "@/_api/scouting-report-api";
import {
  AccordionContainer,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import Button from "@/components/Button";
import { Save } from "lucide-react";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { scoutingReportDB } from "@/_api/firebase-api";
import { logActivity } from "@/_api/activity-api";
import { useAuth } from "@/hooks/useAuth";
import { isAdminEmail } from "@/utils/auth";
import { notify } from "@/lib/notify";
import {
  scoutingGeneratedDesc,
  toastMessage,
} from "@/utils/constants/toastMessage";

type ScoutingReportProps = {
  player: Player | null;
};

const ScoutingReportComponent = ({ player }: ScoutingReportProps) => {
  const { user, role, loading: authLoading } = useAuth();
  const isAdmin =
    role === "admin" || isAdminEmail(user?.email ?? null);
  const [report, setReport] = useState<ScoutingReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isExtending, setIsExtending] = useState(false);
  const [extendError, setExtendError] = useState<string | null>(null);

  useEffect(() => {
    const clear = () => {
      setReport(null);
      setLastUpdated(null);
      setUserNotes("");
      setError(null);
      setIsLoading(false);
    };

    if (!player || authLoading) {
      if (!player) clear();
      return;
    }

    // Load even when logged out — matches public read on `scouting-report` in Firestore rules
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const saved = await scoutingReportDB.get(player.id);
        if (cancelled) return;
        if (saved) {
          setReport(saved.report);
          setLastUpdated(saved.updatedAt);
          // Per-user notes map in Firestore (see scoutingReportDB.updateNotes)
          if (user?.email && saved.userNotes && typeof saved.userNotes === "object") {
            const emailKey = user.email.replace(/\./g, "_");
            const notes = saved.userNotes as Record<string, string>;
            setUserNotes(notes[emailKey] ?? "");
          } else {
            setUserNotes("");
          }
          setIsExpanded(true);
        } else {
          setReport(null);
          setLastUpdated(null);
          setUserNotes("");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error loading saved scouting report:", err);
          const msg =
            err instanceof Error ? err.message : "Failed to load scouting report.";
          setError(msg);
          notify.error(toastMessage.scouting.loadErrorTitle, {
            description: msg,
          });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [player?.id, authLoading, user?.email]);

  const handleGenerateReport = async () => {
    if (!player) return;

    setIsLoading(true);
    setError(null);
    setIsExpanded(true);

    try {
      const generatedReport = await generateScoutingReport(player);
      setReport(generatedReport);
      notify.success(toastMessage.scouting.generateReadyTitle, {
        description: scoutingGeneratedDesc(player.name),
      });
      // Persist to Firebase when a user is logged in
      try {
        await scoutingReportDB.save(player.id, generatedReport);
        setLastUpdated(new Date().toISOString());
        void logActivity({
          actionType: "SCOUTING_REPORT_GENERATED",
          playerId: player.id,
          playerName: player.name,
          description: "Generated scouting report",
        }).catch(() => {});
      } catch (err) {
        console.error("Error saving scouting report to Firebase:", err);
        notify.warning(toastMessage.scouting.cloudWarningTitle, {
          description: toastMessage.scouting.cloudWarningDesc,
        });
      }

    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to generate scouting report. Please try again.";
      setError(msg);
      notify.error(toastMessage.scouting.generateErrorTitle, {
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!player || !report || savingNotes || !user) return;
    setSavingNotes(true);
    try {
      await scoutingReportDB.updateNotes(player.id, userNotes);
      setLastUpdated(new Date().toISOString());
      void logActivity({
        actionType: "SCOUTING_REPORT_NOTES_SAVED",
        playerId: player.id,
        playerName: player.name,
        description: "Saved scouting report notes",
      }).catch(() => {});
      notify.success(toastMessage.scouting.notesSavedTitle, {
        description: toastMessage.scouting.notesSavedDesc,
      });
    } catch (err) {
      console.error("Error saving notes:", err);
      notify.error(toastMessage.scouting.notesErrorTitle, {
        description: toastMessage.scouting.notesErrorDesc,
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const handleAskAiToExtend = async () => {
    if (!player || !report || !aiPrompt.trim() || isExtending) return;
    setIsExtending(true);
    setExtendError(null);
    try {
      const updatedReport = await extendScoutingReportWithPrompt(player, report, aiPrompt.trim());
      setReport(updatedReport);
      await scoutingReportDB.save(player.id, updatedReport);
      setLastUpdated(new Date().toISOString());
      setAiPrompt("");
      void logActivity({
        actionType: "SCOUTING_REPORT_UPDATED",
        playerId: player.id,
        playerName: player.name,
        description: "Updated scouting report with AI",
      }).catch(() => {});
      notify.success(toastMessage.scouting.aiUpdatedTitle, {
        description: toastMessage.scouting.aiUpdatedDesc,
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : toastMessage.scouting.aiErrorFallbackBody;
      setExtendError(msg);
      notify.error(toastMessage.scouting.aiErrorTitle, { description: msg });
    } finally {
      setIsExtending(false);
    }
  };

  if (!player) return null;

  const busyLoading = isLoading || authLoading;

  return (
    <div className="backdrop-blur-[10px] p-5 rounded-lg w-full bg-transparent border border-purplish text-white shadow-lg">
      <AccordionContainer
        type="single"
        collapsible
        className="w-full border-0"
        value={isExpanded ? "scouting" : undefined}
        onValueChange={(value) => setIsExpanded(value === "scouting")}
      >
        <AccordionItem value="scouting" className="border-0">
          <AccordionTrigger className="flex flex-row-reverse justify-end gap-4 hover:no-underline text-xl">
            Scouting Report
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            {busyLoading && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <FaSpinner className="animate-spin text-purple-400" size={32} />
                <p className="text-textGrey">Loading…</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-start gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <FaExclamationTriangle />
                  <span className="font-semibold">Error</span>
                </div>
                <p className="text-sm text-red-300">{error}</p>
                {isAdmin && (
                  <Button
                    onClick={handleGenerateReport}
                    label="Retry"
                    className="!px-4 !py-2 !text-sm"
                  />
                )}
              </div>
            )}

            {report && !busyLoading && (
              <div className="space-y-6">
                {/* Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-purple-300">
                    Summary
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {report.summary}
                  </p>
                </div>

                {/* Strengths */}
                {report.strengths && report.strengths.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-400">
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {report.strengths.map((strength, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <span className="text-green-400 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Limitations or risk factors */}
                {report.weaknesses && report.weaknesses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">
                      Limitations or risk factors
                    </h3>
                    <ul className="space-y-2">
                      {report.weaknesses.map((weakness, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <span className="text-orange-400 mt-1">•</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {report.recommendations && report.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-400">
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {report.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Player Comparison */}
                {report.playerComparison && (
                  <div className="p-4 bg-purple-900/20 border border-purple-500/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">
                      Player Comparison
                    </h3>
                    <p className="text-sm text-gray-300">
                      {report.playerComparison}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-tileBackground space-y-4">
                  {lastUpdated && (
                    <p className="text-xs text-textGrey">
                      Last updated {new Date(lastUpdated).toLocaleString()}
                    </p>
                  )}

                  {isAdmin && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-purple-300">
                        Ask AI to add to this report
                      </h3>
                      <p className="text-sm text-textGrey mb-2">
                        Send a short instruction (e.g. &quot;Focus on his defense&quot;, &quot;Compare with similar PGs&quot;) and the AI will update the report accordingly.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="e.g. Add more on his pick-and-roll defense"
                          className="flex-1 rounded-lg border border-white/30 bg-white/5 text-white placeholder:text-white/50 px-3 py-2 text-sm"
                          disabled={isExtending}
                        />
                        <Button
                          onClick={handleAskAiToExtend}
                          label={isExtending ? "Updating..." : "Update report with AI"}
                          className="!px-4 !py-2 shrink-0"
                          {...((isExtending || !aiPrompt.trim()) && { "aria-disabled": true })}
                        />
                      </div>
                      {extendError && (
                        <p className="text-sm text-red-400 mt-2">{extendError}</p>
                      )}
                    </div>
                  )}

                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">
                      Add your own notes
                    </h3>
                    <p className="text-sm text-textGrey mb-3">
                      Add notes or context that stay with this report (e.g. viewing notes, follow-up).
                    </p>
                    {!user && (
                      <p className="text-xs text-textGrey mb-2">
                        Sign in to add or save notes.
                      </p>
                    )}
                    <textarea
                      value={typeof userNotes === "string" ? userNotes : ""}
                      onChange={(e) => setUserNotes(e.target.value)}
                      placeholder="Type your notes here..."
                      rows={4}
                      disabled={!user}
                      className="w-full rounded-lg border border-white/30 bg-white/5 text-white placeholder:text-white/50 p-3 text-sm resize-y min-h-[100px] focus:border-purplish focus:ring-1 focus:ring-purplish/50 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Button
                      onClick={handleSaveNotes}
                      iconAlignment="right"
                      icon={<Save className="w-4 h-4 shrink-0" aria-hidden />}
                      label={savingNotes ? "Saving..." : "Save notes"}
                      className="!px-5 !py-2.5 mt-3 !bg-purplish/10 hover:!bg-purplish/20 !text-white !border !border-purpleFill/60 rounded-lg transition-colors disabled:opacity-70"
                      {...((savingNotes || !user) && { "aria-disabled": true })}
                    />
                  </div>
                </div>
              </div>
            )}

            {!report && !busyLoading && !error && (
              <div className="text-center py-8">
                {isAdmin ? (
                  <>
                    <p className="text-textGrey mb-4">
                      Generate an AI-powered scouting report based on this
                      player&apos;s statistics and performance data.
                    </p>
                    <Button
                      onClick={handleGenerateReport}
                      label="Generate Scouting Report"
                      className="!px-6 !py-3"
                    />
                  </>
                ) : (
                  <p className="text-textGrey">
                    No scouting report available for this player yet.
                  </p>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </AccordionContainer>
    </div>
  );
};

export default ScoutingReportComponent;

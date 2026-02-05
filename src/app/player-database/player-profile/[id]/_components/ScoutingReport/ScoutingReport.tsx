"use client";

import { useState } from "react";
import { Player } from "@/_api/basketball-api";
import { generateScoutingReport, ScoutingReport } from "@/_api/scouting-report-api";
import {
  AccordionContainer,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import Button from "@/components/Button";
import { FaSpinner, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

type ScoutingReportProps = {
  player: Player | null;
};

const ScoutingReportComponent = ({ player }: ScoutingReportProps) => {
  const [report, setReport] = useState<ScoutingReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGenerateReport = async () => {
    if (!player) return;

    setIsLoading(true);
    setError(null);
    setIsExpanded(true);

    try {
      const generatedReport = await generateScoutingReport(player);
      setReport(generatedReport);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate scouting report. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!player) return null;

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
          <div className="flex items-center justify-between">
            <AccordionTrigger className="flex flex-row-reverse justify-end gap-4 hover:no-underline text-xl">
              AI Scouting Report
            </AccordionTrigger>
            {!report && !isLoading && (
              <Button
                onClick={handleGenerateReport}
                label="Generate Report"
                className="!px-4 !py-2"
              />
            )}
          </div>
          <AccordionContent className="pt-4">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <FaSpinner className="animate-spin text-purple-400" size={32} />
                <p className="text-textGrey">Analyzing player data...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-start gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <FaExclamationTriangle />
                  <span className="font-semibold">Error</span>
                </div>
                <p className="text-sm text-red-300">{error}</p>
                <Button
                  onClick={handleGenerateReport}
                  label="Retry"
                  className="!px-4 !py-2 !text-sm"
                />
              </div>
            )}

            {report && !isLoading && (
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

                {/* Weaknesses */}
                {report.weaknesses && report.weaknesses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">
                      Areas for Improvement
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

                <div className="flex items-center gap-2 pt-2 border-t border-tileBackground">
                  <FaCheckCircle className="text-green-400" size={14} />
                  <span className="text-xs text-textGrey">
                    Report generated using AI analysis
                  </span>
                </div>
              </div>
            )}

            {!report && !isLoading && !error && (
              <div className="text-center py-8">
                <p className="text-textGrey mb-4">
                  Generate an AI-powered scouting report based on this player's
                  statistics and performance data.
                </p>
                <Button
                  onClick={handleGenerateReport}
                  label="Generate Scouting Report"
                  className="!px-6 !py-3"
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </AccordionContainer>
    </div>
  );
};

export default ScoutingReportComponent;

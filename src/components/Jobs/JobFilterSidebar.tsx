"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Industry } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface JobFilterSidebarProps {
  industries: Industry[];
  selectedIndustryIds: string[];
  selectedSubIndustryIds: string[];
  selectedJobTypes: string[];
  selectedEmploymentTypes: string[];
  onFilterChange: (type: string, value: string) => void;
  onClearFilters: () => void;
  isAnyFilterActive: boolean;
}

const JobFilterSidebar = ({
  industries,
  selectedIndustryIds,
  selectedSubIndustryIds,
  selectedJobTypes,
  selectedEmploymentTypes,
  onFilterChange,
  onClearFilters,
  isAnyFilterActive,
}: JobFilterSidebarProps) => {
  const jobTypes = [
    { label: "On-site", value: "ONSITE" },
    { label: "Remote", value: "REMOTE" },
    { label: "Hybrid", value: "HYBRID" },
  ];

  const employmentTypes = [
    { label: "Full-time", value: "FULL_TIME" },
    { label: "Part-time", value: "PART_TIME" },
    { label: "Contractual", value: "CONTRACTUAL" },
    { label: "Internship", value: "INTERNSHIP" },
    { label: "Freelance", value: "FREELANCE" },
  ];

  const flatSubIndustries = industries.flatMap((ind) =>
    (ind.subIndustries || []).map((s) => ({
      ...s,
      industryName: ind.name,
    })),
  );

  return (
    <div className="space-y-8 sticky top-32">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-clash text-foreground">Filters</h3>
          {isAnyFilterActive && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-sm font-bold font-epilogue text-primary hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground font-epilogue">
          Narrow roles by industry, work style, and contract type.
        </p>
      </div>

      <Accordion
        type="multiple"
        defaultValue={[
          "industries",
          "sub-industries",
          "job-types",
          "employment-types",
        ]}
      >
        <AccordionItem value="industries" className="border-none">
          <AccordionTrigger className="text-lg font-bold font-clash text-foreground hover:no-underline py-4">
            Industries
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2 pb-6 max-h-64 overflow-y-auto pr-1">
            {industries?.map((ind) => (
              <div
                key={ind.id}
                role="button"
                tabIndex={0}
                className="flex items-center space-x-3 group cursor-pointer"
                onClick={() => onFilterChange("industryId", ind.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    onFilterChange("industryId", ind.id);
                }}
              >
                <Checkbox
                  id={`ind-${ind.id}`}
                  checked={selectedIndustryIds.includes(ind.id)}
                  className="w-5 h-5 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`ind-${ind.id}`}
                  className="text-base text-muted-foreground font-epilogue cursor-pointer group-hover:text-primary transition-colors"
                >
                  {ind.name}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sub-industries" className="border-none">
          <AccordionTrigger className="text-lg font-bold font-clash text-foreground hover:no-underline py-4">
            Sub-industries
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2 pb-6 max-h-72 overflow-y-auto pr-1">
            {flatSubIndustries.length === 0 ? (
              <p className="text-sm text-muted-foreground/60 font-epilogue">
                No sub-industries loaded.
              </p>
            ) : (
              flatSubIndustries.map((s) => (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  className="flex items-center space-x-3 group cursor-pointer"
                  onClick={() => onFilterChange("subIndustryId", s.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      onFilterChange("subIndustryId", s.id);
                  }}
                >
                  <Checkbox
                    id={`sub-${s.id}`}
                    checked={selectedSubIndustryIds.includes(s.id)}
                    className="w-5 h-5 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor={`sub-${s.id}`}
                    className="text-sm text-muted-foreground font-epilogue cursor-pointer group-hover:text-primary transition-colors leading-snug"
                  >
                    <span className="text-muted-foreground/60 font-medium">
                      {s.industryName}
                    </span>
                    <span className="mx-1 text-border">·</span>
                    {s.name}
                  </Label>
                </div>
              ))
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="job-types" className="border-none">
          <AccordionTrigger className="text-lg font-bold font-clash text-foreground hover:no-underline py-4">
            Job type
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 pb-6">
            {jobTypes.map((type) => (
              <div
                key={type.value}
                role="button"
                tabIndex={0}
                className="flex items-center space-x-3 group cursor-pointer"
                onClick={() => onFilterChange("jobType", type.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    onFilterChange("jobType", type.value);
                }}
              >
                <Checkbox
                  id={`type-${type.value}`}
                  checked={selectedJobTypes.includes(type.value)}
                  className="w-5 h-5 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`type-${type.value}`}
                  className="text-base text-muted-foreground font-epilogue cursor-pointer group-hover:text-primary transition-colors"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="employment-types" className="border-none">
          <AccordionTrigger className="text-lg font-bold font-clash text-foreground hover:no-underline py-4">
            Employment type
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 pb-6">
            {employmentTypes.map((type) => (
              <div
                key={type.value}
                role="button"
                tabIndex={0}
                className="flex items-center space-x-3 group cursor-pointer"
                onClick={() => onFilterChange("employmentType", type.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    onFilterChange("employmentType", type.value);
                }}
              >
                <Checkbox
                  id={`emp-${type.value}`}
                  checked={selectedEmploymentTypes.includes(type.value)}
                  className="w-5 h-5 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`emp-${type.value}`}
                  className="text-base text-muted-foreground font-epilogue cursor-pointer group-hover:text-primary transition-colors"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default JobFilterSidebar;

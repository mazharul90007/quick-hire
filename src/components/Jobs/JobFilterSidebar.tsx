"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Category } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface JobFilterSidebarProps {
    categories: Category[];
    selectedCategories: string[];
    selectedJobTypes: string[];
    selectedEmploymentTypes: string[];
    onFilterChange: (type: string, value: string) => void;
    onClearFilters: () => void;
    isAnyFilterActive: boolean;
}

const JobFilterSidebar = ({
    categories,
    selectedCategories,
    selectedJobTypes,
    selectedEmploymentTypes,
    onFilterChange,
    onClearFilters,
    isAnyFilterActive,
}: JobFilterSidebarProps) => {
    const jobTypes = [
        { label: "Remote", value: "REMOTE" },
        { label: "In-Person", value: "IN_PERSON" },
        { label: "Hybrid", value: "HYBRID" },
    ];

    const employmentTypes = [
        { label: "Full-Time", value: "FULL_TIME" },
        { label: "Part-Time", value: "PART_TIME" },
        { label: "Contract", value: "CONTRACT" },
        { label: "Internship", value: "INTERNSHIP" },
    ];

    return (
        <div className="space-y-8 sticky top-32">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold font-clash text-[#2D2D2D]">Filters</h3>
                    {isAnyFilterActive && (
                        <button
                            onClick={onClearFilters}
                            className="text-sm font-bold font-epilogue text-[#4640DE] hover:underline cursor-pointer"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
                <p className="text-sm text-[#515B6F] font-epilogue">Showing jobs based on your preference</p>
            </div>

            <Accordion type="multiple" defaultValue={["categories", "job-types", "employment-types"]}>
                {/* Categories */}
                <AccordionItem value="categories" className="border-none">
                    <AccordionTrigger className="text-lg font-bold font-clash text-[#2D2D2D] hover:no-underline py-4">
                        Categories
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 pb-6">
                        {categories?.map((category) => (
                            <div key={category.id} className="flex items-center space-x-3 group cursor-pointer" onClick={() => onFilterChange("categoryId", category.id)}>
                                <Checkbox
                                    id={`cat-${category.id}`}
                                    checked={selectedCategories.includes(category.id)}
                                    className="w-5 h-5 rounded-none border-zinc-300 data-[state=checked]:bg-[#4640DE] data-[state=checked]:border-[#4640DE]"
                                />
                                <Label
                                    htmlFor={`cat-${category.id}`}
                                    className="text-base text-[#515B6F] font-epilogue cursor-pointer group-hover:text-[#4640DE] transition-colors"
                                >
                                    {category.title}
                                </Label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Job Types */}
                <AccordionItem value="job-types" className="border-none">
                    <AccordionTrigger className="text-lg font-bold font-clash text-[#2D2D2D] hover:no-underline py-4">
                        Job Type
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 pb-6">
                        {jobTypes.map((type) => (
                            <div key={type.value} className="flex items-center space-x-3 group cursor-pointer" onClick={() => onFilterChange("jobType", type.value)}>
                                <Checkbox
                                    id={`type-${type.value}`}
                                    checked={selectedJobTypes.includes(type.value)}
                                    className="w-5 h-5 rounded-none border-zinc-300 data-[state=checked]:bg-[#4640DE] data-[state=checked]:border-[#4640DE]"
                                />
                                <Label
                                    htmlFor={`type-${type.value}`}
                                    className="text-base text-[#515B6F] font-epilogue cursor-pointer group-hover:text-[#4640DE] transition-colors"
                                >
                                    {type.label}
                                </Label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Employment Types */}
                <AccordionItem value="employment-types" className="border-none">
                    <AccordionTrigger className="text-lg font-bold font-clash text-[#2D2D2D] hover:no-underline py-4">
                        Employment Type
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 pb-6">
                        {employmentTypes.map((type) => (
                            <div key={type.value} className="flex items-center space-x-3 group cursor-pointer" onClick={() => onFilterChange("employmentType", type.value)}>
                                <Checkbox
                                    id={`emp-${type.value}`}
                                    checked={selectedEmploymentTypes.includes(type.value)}
                                    className="w-5 h-5 rounded-none border-zinc-300 data-[state=checked]:bg-[#4640DE] data-[state=checked]:border-[#4640DE]"
                                />
                                <Label
                                    htmlFor={`emp-${type.value}`}
                                    className="text-base text-[#515B6F] font-epilogue cursor-pointer group-hover:text-[#4640DE] transition-colors"
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

"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import districts from "../shared/districts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface JobSearchHeaderProps {
    onSearch: (searchTerm: string, district: string) => void;
    initialSearchTerm?: string;
    initialDistrict?: string;
}

const JobSearchHeader = ({ onSearch, initialSearchTerm = "", initialDistrict = "" }: JobSearchHeaderProps) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [district, setDistrict] = useState(initialDistrict);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm, district);
    };

    return (
        <div className="bg-[#F8F8FD] py-20 border-b border-zinc-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-clash text-[#2D2D2D]">
                            Find your <span className="text-[#4640DE]">dream job</span>
                        </h1>
                        <p className="text-[#515B6F] font-epilogue text-lg max-w-2xl mx-auto">
                            Browse through thousands of job openings and find the one that fits you best.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-2 shadow-xl shadow-zinc-200/50 flex flex-col md:flex-row items-center gap-2 group focus-within:ring-2 focus-within:ring-[#4640DE]/20 transition-all"
                    >
                        <div className="flex items-center gap-3 px-4 py-2 grow w-full border-b md:border-b-0 md:border-r border-zinc-100">
                            <Search className="text-[#4640DE]" size={24} />
                            <input
                                type="text"
                                placeholder="Job title or keyword"
                                className="w-full bg-transparent outline-none font-epilogue text-[#2D2D2D] py-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 grow w-full">
                            <MapPin className="text-[#4640DE]" size={24} />
                            <Select onValueChange={(value) => setDistrict(value)} value={district}>
                                <SelectTrigger className="w-full bg-transparent border-none focus:ring-0 px-0 h-auto font-epilogue text-[#2D2D2D] py-2 cursor-pointer shadow-none">
                                    <SelectValue placeholder="Location (District)" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 rounded-xl border-zinc-100 shadow-2xl">
                                    {districts.map((districtItem) => (
                                        <SelectItem key={districtItem} value={districtItem} className="font-epilogue">
                                            {districtItem}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="submit"
                            className="bg-[#4640DE] hover:bg-[#3b36c0] text-white px-10 py-7 font-bold font-epilogue text-lg w-full md:w-auto rounded-none transition-all shadow-lg shadow-[#4640DE]/20"
                        >
                            Search
                        </Button>
                    </form>

                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-epilogue text-[#515B6F]">
                        <span className="font-semibold text-zinc-400">Popular:</span>
                        <button className="hover:text-[#4640DE] hover:underline underline-offset-4 decoration-2">Designer</button>
                        <button className="hover:text-[#4640DE] hover:underline underline-offset-4 decoration-2">Developer</button>
                        <button className="hover:text-[#4640DE] hover:underline underline-offset-4 decoration-2">Digital Marketing</button>
                        <button className="hover:text-[#4640DE] hover:underline underline-offset-4 decoration-2">Business</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSearchHeader;

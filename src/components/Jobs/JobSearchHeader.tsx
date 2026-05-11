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

import { Sparkles } from "lucide-react";

interface JobSearchHeaderProps {
    onSearch: (searchTerm: string, district: string, isAiMode: boolean) => void;
    initialSearchTerm?: string;
    initialDistrict?: string;
}

const JobSearchHeader = ({ onSearch, initialSearchTerm = "", initialDistrict = "" }: JobSearchHeaderProps) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [district, setDistrict] = useState(initialDistrict);
    const [isAiMode, setIsAiMode] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm, district, isAiMode);
    };

    return (
        <div className="bg-muted/10 py-20 border-b border-border/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-clash text-foreground">
                            Find your <span className="text-primary">dream job</span>
                        </h1>
                        <p className="text-muted-foreground font-epilogue text-lg max-w-2xl mx-auto">
                            Browse through thousands of job openings and find the one that fits you best.
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-4">
                        <button
                            type="button"
                            onClick={() => setIsAiMode(false)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${!isAiMode ? 'bg-primary text-white shadow-md' : 'bg-card text-muted-foreground hover:bg-muted/50 border border-border/50'}`}
                        >
                            Standard Search
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAiMode(true)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all ${isAiMode ? 'bg-primary text-white shadow-md' : 'bg-card text-muted-foreground hover:bg-muted/50 border border-border/50'}`}
                        >
                            <Sparkles size={18} className={isAiMode ? 'text-white' : 'text-primary'} />
                            AI Match
                        </button>
                    </div>

                    {isAiMode && (
                        <div className="flex items-center justify-center gap-2 mb-2 text-primary font-bold text-sm animate-in fade-in slide-in-from-bottom-2">
                            <Sparkles size={16} className="animate-pulse" />
                            AI SEARCH ACTIVE: Describe your dream role and get the top 5 closest matches!
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="bg-card p-2 shadow-xl shadow-primary/5 border border-border/50 flex flex-col md:flex-row items-center gap-2 group focus-within:ring-2 focus-within:ring-primary/20 transition-all rounded-xl"
                    >
                        {!isAiMode ? (
                            <>
                                <div className="flex items-center gap-3 px-4 py-2 grow w-full border-b md:border-b-0 md:border-r border-border/50">
                                    <Search className="text-primary" size={24} />
                                    <input
                                        type="text"
                                        placeholder="Job title or keyword"
                                        className="w-full bg-transparent outline-none font-epilogue text-foreground py-2"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2 grow w-full">
                                    <MapPin className="text-primary" size={24} />
                                    <Select onValueChange={(value) => setDistrict(value)} value={district}>
                                        <SelectTrigger className="w-full bg-transparent border-none focus:ring-0 px-0 h-auto font-epilogue text-foreground py-2 cursor-pointer shadow-none">
                                            <SelectValue placeholder="Location (District)" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 rounded-xl border-border/50 shadow-2xl">
                                            {districts.map((districtItem) => (
                                                <SelectItem key={districtItem} value={districtItem} className="font-epilogue">
                                                    {districtItem}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 px-4 py-2 grow w-full">
                                <Sparkles className="text-primary" size={24} />
                                <input
                                    type="text"
                                    placeholder="Describe your ideal job (e.g., Remote React role with good benefits)"
                                    className="w-full bg-transparent outline-none font-epilogue text-foreground py-2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        )}
                        
                        <Button
                            type="submit"
                            className={`text-white px-10 py-7 font-bold font-epilogue text-lg w-full md:w-auto rounded-xl transition-all shadow-lg bg-primary hover:brightness-110 shadow-primary/20`}
                        >
                            Search
                        </Button>
                    </form>

                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-epilogue text-muted-foreground">
                        <span className="font-semibold text-border">Popular:</span>
                        <button className="hover:text-primary hover:underline underline-offset-4 decoration-2">Designer</button>
                        <button className="hover:text-primary hover:underline underline-offset-4 decoration-2">Developer</button>
                        <button className="hover:text-primary hover:underline underline-offset-4 decoration-2">Digital Marketing</button>
                        <button className="hover:text-primary hover:underline underline-offset-4 decoration-2">Business</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSearchHeader;

"use client";

import { Button } from "@/components/ui/button";
import { UserPlus, Search, MoreHorizontal, Mail, Shield, UserX } from "lucide-react";

export default function ManageUsersPage() {
    // Placeholder users since base-auth might have its own way or we need an API
    const users = [
        { id: "1", name: "Sourabh", email: "sourabh@example.com", role: "Admin", status: "Active" },
        { id: "2", name: "John Doe", email: "john@example.com", role: "User", status: "Active" },
        { id: "3", name: "Jane Smith", email: "jane@example.com", role: "User", status: "Pending" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold font-clash text-[#2D2D2D]">User Management</h1>
                    <p className="text-[#515B6F] font-epilogue">Manage team members and their application access.</p>
                </div>
                <Button className="bg-[#4640DE] hover:bg-[#3b36c0] text-white h-12 px-6 font-bold font-epilogue rounded-none font-bold">
                    <UserPlus className="mr-2" size={18} />
                    Add User
                </Button>
            </div>

            <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-100">
                                <th className="p-6 font-bold font-clash text-[#2D2D2D] text-sm uppercase tracking-wider">User</th>
                                <th className="p-6 font-bold font-clash text-[#2D2D2D] text-sm uppercase tracking-wider">Role</th>
                                <th className="p-6 font-bold font-clash text-[#2D2D2D] text-sm uppercase tracking-wider">Status</th>
                                <th className="p-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-50/50 transition-all font-epilogue group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-zinc-100 rounded-none flex items-center justify-center font-bold text-[#4640DE]">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#2D2D2D]">{user.name}</div>
                                                <div className="text-xs text-[#515B6F]">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={cn(
                                            "text-xs font-bold px-3 py-1 uppercase tracking-tighter",
                                            user.role === "Admin" ? "bg-indigo-50 text-[#4640DE]" : "bg-zinc-50 text-zinc-500"
                                        )}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                user.status === "Active" ? "bg-emerald-500" : "bg-orange-500"
                                            )} />
                                            <span className="text-sm font-bold text-[#2D2D2D]">{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-zinc-400 hover:text-[#4640DE] transition-colors"><Shield size={18} /></button>
                                            <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors"><UserX size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Utility for localized cn
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}

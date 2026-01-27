import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { PiReadCvLogo } from "react-icons/pi";
import { IoLocationSharp } from "react-icons/io5";
import { LuMails} from "react-icons/lu";
import { FaPhoneSquareAlt} from "react-icons/fa";
import {TbCategoryFilled} from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import {RiLinksLine, RiTeamFill} from "react-icons/ri";
import {GoProjectSymlink} from "react-icons/go";
import {VscTypeHierarchy} from "react-icons/vsc";
import {CgStyle} from "react-icons/cg";
import {MdPersonAddAlt1} from "react-icons/md";

const menuGroups = [
    {
        title: "Team",
        key: "team",
        links: [
            { href: "/admin/team", label: "Team", icon: RiTeamFill },
        ],
    },
    {
        title: "Projects",
        key: "projects",
        links: [
            { href: "/admin/projects", label: "Projects", icon: GoProjectSymlink},
            { href: "/admin/project-location", label: "Location", icon: FaLocationDot},
            { href: "/admin/project-type", label: "Type", icon: VscTypeHierarchy},
            { href: "/admin/project-style", label: "Style", icon: CgStyle},
        ],
    },
    {
        title: "News",
        key: "news",
        links: [
            { href: "/admin/news", label: "News", icon: PiReadCvLogo},
            { href: "/admin/news-category", label: "News category", icon: TbCategoryFilled },
        ],
    },
    {
        title: "Vacancy",
        key: "vacancy",
        links: [
            { href: "/admin/vacancy", label: "Vacancy", icon: MdPersonAddAlt1 },
        ],
    },
    {
        title: "Contacts",
        key: "contacts",
        links: [
            { href: "/admin/address", label: "Address", icon: IoLocationSharp },
            { href: "/admin/mails", label: "Mails", icon: LuMails },
            { href: "/admin/numbers", label: "Numbers", icon: FaPhoneSquareAlt },
            { href: "/admin/social-links", label: "Social Links", icon: RiLinksLine  },
        ],
    },
];

const Sidebar = () => {
    const pathname = usePathname();
    const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const newOpenGroups: { [key: string]: boolean } = {};
        for (const group of menuGroups) {
            if (group.links.some((link) => pathname.startsWith(link.href))) {
                newOpenGroups[group.key] = true;
            }
        }
        setOpenGroups((prev) => ({ ...prev, ...newOpenGroups }));
    }, [pathname]);

    const toggleGroup = (key: string) => {
        setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    return (
        <aside className="w-64 bg-white shadow-md h-screen fixed" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto space-y-4">
                <div>
                    <a
                        href="/admin"
                        className="block p-2 font-semibold text-gray-900 rounded-lg hover:bg-gray-100"
                    >
                        Dashboard
                    </a>
                </div>

                {menuGroups.map((group) => (
                    <div key={group.key}>
                        <button
                            onClick={() => toggleGroup(group.key)}
                            className="w-full text-left px-2 py-2 text-sm font-bold text-gray-600 uppercase hover:bg-gray-100 rounded"
                        >
                            {group.title}
                        </button>

                        {openGroups[group.key] && (
                            <ul className="mt-1 space-y-1 ml-2">
                                {group.links.map(({ href, label, icon: Icon }) => (
                                    <li
                                        key={href}
                                        className={`flex items-center p-2 rounded-md font-medium ${
                                            isActive(href) ? "bg text-white" : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Icon className={`size-5 ${isActive(href) ? "text-white" : "text-gray-500"}`} />
                                        <a href={href} className="ml-3 w-full block">
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;

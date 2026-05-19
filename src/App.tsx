/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home as HomeIcon, AlertTriangle, ShieldCheck, Database, LayoutDashboard, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import ReportPage from "./pages/ReportPage";
import DatabasePage from "./pages/DatabasePage";
import ResourcesPage from "./pages/ResourcesPage";
import AdminPage from "./pages/AdminPage";
import { cn } from "./lib/utils";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "홈", path: "/", icon: HomeIcon },
    { name: "위험 신고", path: "/report", icon: AlertTriangle },
    { name: "신고 내역", path: "/database", icon: Database },
    { name: "안전 정보", path: "/resources", icon: ShieldCheck },
    { name: "관리자", path: "/admin", icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <ShieldCheck className="text-dark w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">안전한 회기동</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  location.pathname === item.path
                    ? "bg-primary/20 text-dark"
                    : "text-gray-500 hover:bg-muted hover:text-dark"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-500 hover:bg-muted hover:text-dark transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-muted overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                    location.pathname === item.path
                      ? "bg-primary/20 text-dark"
                      : "text-gray-500 hover:bg-muted"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      <footer className="bg-white border-t border-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="text-primary w-6 h-6" />
                <span className="text-lg font-bold">안전한 회기동 만들기</span>
              </div>
              <p className="text-sm text-gray-500">
                경희대학교 시민과학 수업 프로젝트 '소금제비' 조가 운영합니다.
                우리는 회기동의 모든 아이들이 방임되지 않고 안심하고 다닐 수 있는 동네를 만들기 위해 노력합니다.
              </p>
            </div>
            <div className="text-sm text-gray-400 md:text-right">
              © 2026 소금제비 (Kyung Hee Univ. Citizen Science). All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

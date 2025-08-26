import React, { useState, useEffect } from "react";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const router = useRouter();

  const { user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const navItems = [
    { label: "Página inicial", path: "/dashboard" },
    { label: "Propriedades", path: "/propriedades" },
    { label: "Rebanho", path: "/rebanho" },
    { label: "Lactação", path: "/lactacao" },
    { label: "Alimentação", path: "/alimentacao" },
    { label: "Controle Reprodução", path: "/reproducao" },
    { label: "Manejo", path: "/manejo" },
    { label: "Equipe", path: "/equipe" },
    { label: "Industria", path: "/industria" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;

    const doc = document;
    const docEl = doc.documentElement;

    const isCurrentlyFullscreen = !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    if (!isCurrentlyFullscreen) {
      if (docEl.requestFullscreen) docEl.requestFullscreen();
      else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
      else if (docEl.mozRequestFullScreen) docEl.mozRequestFullScreen();
      else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
    } else {
      if (doc.exitFullscreen) doc.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;

    const updateFullscreenStatus = () => {
      const doc = document;
      const isFs = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener("fullscreenchange", updateFullscreenStatus);
    document.addEventListener("webkitfullscreenchange", updateFullscreenStatus);
    document.addEventListener("mozfullscreenchange", updateFullscreenStatus);
    document.addEventListener("MSFullscreenChange", updateFullscreenStatus);

    updateFullscreenStatus();

    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenStatus);
      document.removeEventListener(
        "webkitfullscreenchange",
        updateFullscreenStatus
      );
      document.removeEventListener(
        "mozfullscreenchange",
        updateFullscreenStatus
      );
      document.removeEventListener(
        "MSFullscreenChange",
        updateFullscreenStatus
      );
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsUserMenuOpen(false);
      await logout();
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  const handleViewProfile = () => {
    router.push("/perfil");
    setIsUserMenuOpen(false);
  };

  const handleSystemSettings = () => {
    setIsUserMenuOpen(false);
    router.push("/configuracoes");
  };

  return (
    <>
      <nav
        className="bg-[var(--color-primary)] px-0 shadow-md fixed top-0 left-0 right-0 z-[1000]"
        role="navigation"
        aria-label="Principal"
      >
        <div className="w-full flex items-center justify-between px-16 h-16 relative lg:px-20">
          {/* Logo e Menu Hamburguer */}
          <div className="flex items-center absolute left-8 z-10 gap-3">
            <Link href="/dashboard" passHref>
              <img
                src="/images/Logo-buffs.svg"
                alt="Buffs Logo"
                className="h-8 w-auto cursor-pointer transition-transform duration-200 hover:scale-105"
              />
            </Link>

            {/* Botão menu mobile - Movido para cá */}
            <div className="xl:hidden flex items-center">
              <button
                className="text-[var(--color-text-dark)] p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMobileMenu();
                }}
                aria-label="Abrir menu de navegação"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/*  Alterado breakpoint de md para xl (1280px) para menu desktop */}
          {/* Navigation Items - Desktop */}
          <div className="hidden xl:flex items-center gap-0 absolute left-1/2 transform -translate-x-1/2 z-5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-5 py-4 text-[var(--color-text-dark)] no-underline font-medium text-base transition-all duration-200 border-b-3 border-transparent whitespace-nowrap h-16 flex items-center hover:bg-white/10 hover:text-[var(--color-text-dark)] ${
                  router.pathname === item.path
                    ? "bg-white/20 border-b-[var(--color-text-dark)] font-semibold"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Fullscreen Toggle and User Profile */}
          <div className="flex items-center absolute right-8 z-10 lg:right-10 gap-3">
            {/* Botão de Tela Cheia */}
            <button
              onClick={toggleFullscreen}
              className="p-2 cursor-pointer transition-colors duration-200 text-[var(--color-text-dark)] hover:opacity-80"
              aria-label={
                isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia"
              }
              title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            >
              {isFullscreen ? (
                <FiMinimize className="w-5 h-5" />
              ) : (
                <FiMaximize className="w-5 h-5" />
              )}
            </button>

            {/* Menu usuário */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleUserMenu();
                }}
                className="w-10 h-10 rounded-full bg-white border-2 border-white/30 cursor-pointer transition-all duration-200 hover:border-white/60 hover:scale-105"
                aria-label="Menu do usuário"
              >
                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    {/* Info usuário */}
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">
                        {user?.name || "Usuário"}
                      </div>
                      <div className="text-gray-500">
                        {user?.email || "sem-email@dominio.com"}
                      </div>
                    </div>

                    {/* Visualizar perfil */}
                    <button
                      onClick={handleViewProfile}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Visualizar perfil</span>
                    </button>

                    {/* Configurações do Sistema */}
                    <button
                      onClick={handleSystemSettings}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 11V7a1 1 0 112 0v4a1 1 0 11-2 0zm0 6a1 1 0 112 0v-2a1 1 0 11-2 0v2z"
                        />
                      </svg>
                      <span>Configurações</span>
                    </button>

                    {/* Sair */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/*  Alterado breakpoint de md para xl para botão menu mobile */}
          {/* Botão menu mobile */}
          
        </div>
      </nav>

      {/*  Transformado menu mobile em sidebar lateral com animação */}
      {/* Mobile Menu - Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="xl:hidden fixed inset-0 bg-black/45 z-40 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div
            className={`xl:hidden fixed top-0 left-0 h-full w-80 bg-[var(--color-primary)] shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Sidebar */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <img
                src="/images/Logo-buffs.svg"
                alt="Buffs Logo"
                className="h-8 w-auto"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[var(--color-text-dark)] p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                aria-label="Fechar menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-6 py-4 text-[var(--color-text-dark)] no-underline font-medium text-base transition-all duration-200 ${
                    router.pathname === item.path
                      ? "bg-white/20 font-semibold border-r-4 border-white"
                      : "hover:bg-white/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/20 bg-[var(--color-primary)]">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[var(--color-text-dark)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[var(--color-text-dark)] font-medium text-sm">
                      {user?.name || "Usuário"}
                    </div>
                    <div className="text-[var(--color-text-dark)]/70 text-xs">
                      {user?.email || "sem-email@dominio.com"}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      handleViewProfile();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[var(--color-text-dark)] text-sm hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Visualizar perfil</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleSystemSettings();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[var(--color-text-dark)] text-sm hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Configurações</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-400 text-sm hover:bg-red-500/10 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Fecha menu usuário clicando fora */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;

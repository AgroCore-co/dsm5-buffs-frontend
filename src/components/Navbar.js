import React, { useState, useEffect } from "react";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAuth } from '@/hooks/useAuth';


const Navbar = () => {
  const router = useRouter();

  const { logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const navItems = [
    { label: "Página inicial", path: "/dashboard" },
    { label: "Rebanho", path: "/rebanho" },
    { label: "Lactação", path: "/lactacao" },
    { label: "Alimentação", path: "/alimentacao" },
    { label: "Controle Reprodução", path: "/reproducao" },
    { label: "Manejo", path: "/manejo" },
    { label: "Equipe", path: "/equipe" },
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
      document.removeEventListener("mozfullscreenchange", updateFullscreenStatus);
      document.removeEventListener("MSFullscreenChange", updateFullscreenStatus);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsUserMenuOpen(false);
      await logout();
    } catch (error) {
      console.error('Erro no logout:', error);
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
        className="bg-[var(--color-primary)] px-0 shadow-md fixed top-0 left-0 right-0 z-50"
        role="navigation"
        aria-label="Principal"
      >
        <div className="w-full flex items-center justify-between px-16 h-16 relative lg:px-20">
          {/* Logo */}
          <div className="flex items-center absolute left-8 z-10">
            <Link href="/dashboard" passHref>
              <img
                src="/images/Logo-buffs.svg"
                alt="Buffs Logo"
                className="h-8 w-auto cursor-pointer transition-transform duration-200 hover:scale-105"
              />
            </Link>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center gap-0 absolute left-1/2 transform -translate-x-1/2 z-5">
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
              aria-label={isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia"}
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
                      <div className="font-medium">Usuário</div>
                      <div className="text-gray-500">usuario@email.com</div>
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

          {/* Botão menu mobile */}
          <div className="md:hidden flex items-center absolute right-20 z-10">
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
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed top-16 left-0 right-0 bg-[var(--color-primary)] shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-6 py-4 text-[var(--color-text-dark)] no-underline font-medium text-base border-b border-white/20 transition-all duration-200 ${
                    router.pathname === item.path
                      ? "bg-white/20 font-semibold"
                      : "hover:bg-white/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-white/20">
                <button
                  onClick={() => {
                    handleViewProfile();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-4 text-left text-[var(--color-text-dark)] font-medium text-base border-b border-white/20 hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
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
                  className="w-full px-6 py-4 text-left text-[var(--color-text-dark)] font-medium text-base border-b border-white/20 hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
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
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-4 text-left text-red-600 font-medium text-base hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
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
      )}

      {/* Fecha menu usuário clicando fora */}
      {isUserMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;

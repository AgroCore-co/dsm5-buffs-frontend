/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// --- ANIMAÇÃO BUFFS (LOGO ÚNICA COR + CORREÇÃO DE DUPLICIDADE) ---
if (process.env.NODE_ENV === 'development') {
  // O Next.js carrega este arquivo múltiplas vezes. 
  // Usamos uma variável global para garantir que o logo só apareça uma vez.
  if (!global.hasBuffsLog) {
    global.hasBuffsLog = true;

    const logoArt = [
      "           ░░░░░░░░░                                                   ░░░░░░░░░           ",
      "        ░░▒▒░░▒▒░░                                                       ░░▒░░░▒▒░░        ",
      "      ░▒▒░░░▓▓▒                                                             ░▓▓░░░▒▒░      ",
      "     ░▓░░░░▓▒░                       ░░▒▒░       ▒░▒░░                       ░▒▓▒░░░▓░     ",
      "    ░▒░░░░▓▒                     ░░░░▒░░░░░░░░░░░░░░░▒░░░░                     ▒▓░░░░▒░    ",
      "    ▒▓░░░░█░                  ░░▒▓░░░░░░░░░░░▓░░░░░░░░░░░▓▒░░                  ░▓░░░░▓▒    ",
      "   ░▓▒░░░░█░              ░░░▒░░░░░░░░░▒░░░░░░░░░░░▒░░░░░░░░░▒░░░              ░▓░░░░▒▓░   ",
      "   ░▓▒░░░░▓▒            ░▒▒▒░░░░░░▒▒▓▒▒▒▒▒▒▓▓▓▓▓▒▒░▒▒▒▓▒▒░░░░░░▒▒▒░            ▒▓░░░░▒▓░   ",
      "   ░▓▒░░░▒▓▒▒░░      ░▒▓▒░░░░░░▓█▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓█▓▒░░░░░▒▓▒░       ▒▒▒▒▒░░░▒▓░   ",
      "   ░▒▓░░░░░▓▒▒▒░░░░░░░░░░░▓█████▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓█████▓░░░░░░░░░░▒▒▒▒▓░░░░░▓▒░   ",
      "    ░▒▒░░░░░░▒▒▓▓▒░░░░░▒███▓░░░░░░▓▒▒▒▒▒▒▒▒▓▒▒▒▓▒▒▒▒▒▒▒▒▓░░░░░░▓███▓░░░░░▒▓▓▒▒░░░░░░▒▒░    ",
      "     ░▒▒░░░░░░░░░░░░▓██▓░░░▒▓▓▓▓▓▓▒▒▒▒▓▓▓▒▒▓▒▒▒▓▒▒▒▓▒▒▒▒▒▓▓▓▓▓▓▒░░░▓██▓░░░░░░░░░░░░▒▒░     ",
      "      ░▒▒░░▒██▓████▓░░░░▓▓▓▓▓▒▓▒▒▒▒▒▒▓▒▓▒▒▒▒▒▓▓▒▒▒▒▓▒▓▒▒▒▒▒▒▓▒▓▓▓▓▓░░░░▓████▓██▒░░▓▒░      ",
      "        ░░▒░░░░░░░░▒▓▓▓▓▓▓▓▓▒▓▒▒▒▓▓▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▓▒▓▓▓▓▓▓▓▓▒░░░░░░░▒▓▒░        ",
      "           ░░▒▓█▓▓▓▓▓▓▓▓▓▒▒▓▒▒▒▒▒▒▓▓▓▒▒▒▓▓▒▒▒▒▒▒▒▓▓▒▒▒▓▓▓▒▒▒▒▒▒▓▒▒▓▓▓▓▓▓▓▓▓▓▓▒░░           ",
      "               ▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▒▒▒▒▒▒▒▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓               ",
      "             ░▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒░             ",
      "            ░▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▓░            ",
      "           ░▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▓▓▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒░           ",
      "          ░▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▒▒▒▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓░          ",
      "         ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▓▒▒▓▓▓▓███▓▓▒▓▓███▓▓▓▓▒▒▓▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░         ",
      "        ░▒▓▒▒▒▒▒▒▒▒▒▒▒▒▓▒▓▓▓▓▓▓▒▒▒▓▓▒▓▓░░░░▒▓▒▓▒░░░░▓▓▒▓▓▓▒▒▓▓▓▓▓▓▒▓▒▓▒▒▒▒▒▒▒▒▒▒▒▒░        ",
      "        ░▓▒▓▓▓▓▓▓▓▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▓▒░▓░░░░▓█▓░░░░▒░▒▓▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▓▓▓▓▓▓▒▓▒        ",
      "        ░░▒▓▒▒▒▒▒▓▓▒░░░░░░░░░░░ ░▒▒▒▓░▒█▓▒░░░░░░░░▓█▒░▓▒▒▓░ ░░░░░░░░░░░▒▓▓▒▒▒▒▒▒▒░░        ",
      "           ░░░░░░░░              ░▒▒█░░▓██▓░░░░░▒██▓░░█▒▒░              ░░░░░░░░           ",
      "                                  ░▒▒░░░░░░▒▒▓▓▒░░░░░░▒▓░                                  ",
      "                                   ░░▓▒▒██▓▓▒▒▒▓▓██▒▒▓░▒                                   ",
      "                                   ░░░▒▒░▒▓▓▓▓▓▓▓▒░▒▒░░░                                   ",
      "                                       ░▒░░░░▒░░░░▒░                                       ",
      "                                         ░░░░ ░░░░                                         "
    ];

    const reset = "\x1b[0m";
    const cyan = "\x1b[36m"; // Cor única (Ciano) para o logo
    const green = "\x1b[32m"; 
    const bold = "\x1b[1m";

    console.log("\n"); // Espaço inicial

    // 1. Renderiza o logo com uma cor única
    logoArt.forEach((line) => {
      console.log(`${cyan}${line}${reset}`);
    });
    console.log("\n");

    // 2. Animação simples de "Loading"
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let frameCount = 0;
    
    process.stdout.write("\x1b[?25l"); // Esconde o cursor

    const loader = setInterval(() => {
      const frame = frames[frameCount % frames.length];
      // \r volta para o início da linha para reescrever
      process.stdout.write(`\r   ${cyan}${frame} Inicializando Sistema Buffs...${reset}`);
      frameCount++;
    }, 80);

    // 3. Finaliza a animação
    setTimeout(() => {
      clearInterval(loader);
      // Limpa a linha atual completamente antes de escrever a mensagem final
      process.stdout.write(`\r\x1b[K   ${bold}${green}✔ Sistema Buffs Online${reset}\n\n`);
      process.stdout.write("\x1b[?25h"); // Restaura o cursor
    }, 2500);
  }
}

export default nextConfig;
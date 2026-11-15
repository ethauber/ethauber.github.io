document.addEventListener('DOMContentLoaded', () => {
    // Inject Terminal HTML
    const terminalHTML = `
        <div id="terminal-overlay" role="dialog" aria-modal="true" aria-label="Interactive terminal">
            <div class="terminal-content">
                <div class="terminal-header">
                    <pre>
  _____ _ _   _       _
 | ____| (_) (_) __ _| |__
 |  _| | | | | |/ _\` | '_ \\
 | |___| | | | | (_| | | | |
 |_____|_|_|_/ |\\__,_|_| |_|
           |__/
                    </pre>
                    <p>Elijah Hauber Interactive Terminal [Version 1.0.0]</p>
                    <p>Type 'help' for available commands.</p>
                </div>
                <div id="terminal-history"></div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">visitor@ethauber.io:~$</span>
                    <input type="text" id="terminal-input" aria-label="Terminal command" autocomplete="off" spellcheck="false">
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', terminalHTML);

    const overlay = document.getElementById('terminal-overlay');
    const input = document.getElementById('terminal-input');
    const history = document.getElementById('terminal-history');
    let isOpen = false;
    let previousOverflow = '';
    let previousFocus = null;
    let pendingTrekTimer = null;
    let terminalSessionId = 0;

    function clearPendingTrekLaunch() {
        if (pendingTrekTimer !== null) {
            clearTimeout(pendingTrekTimer);
            pendingTrekTimer = null;
        }
    }

    function isEditable(el) {
        if (window.EasterEggUtils) {
            return window.EasterEggUtils.isEditableElement(el);
        }
        return el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
    }

    // Toggle Terminal
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            // Let ` and ~ be typed normally in other inputs on the page
            if (isEditable(e.target) && e.target !== input) return;
            if (!isOpen) {
                e.preventDefault();
                openTerminal();
            } else {
                e.preventDefault();
                closeTerminal();
            }
        }

        // Escape to close
        if (e.key === 'Escape' && isOpen) {
            closeTerminal();
        }
    });

    function openTerminal() {
        clearPendingTrekLaunch();
        terminalSessionId++;
        previousFocus = document.activeElement;
        previousOverflow = document.body.style.overflow;
        overlay.classList.add('open');
        input.focus();
        isOpen = true;
        document.body.style.overflow = 'hidden'; // Lock scroll
    }

    function closeTerminal() {
        clearPendingTrekLaunch();
        overlay.classList.remove('open');
        isOpen = false;
        document.body.style.overflow = previousOverflow; // Unlock scroll
        input.value = '';
        if (previousFocus && typeof previousFocus.focus === 'function') {
            previousFocus.focus();
        }
    }

    // Handle Input
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                processCommand(command);
            }
            input.value = '';
            // Scroll to bottom
            // Timeout to allow DOM update
            setTimeout(() => {
                overlay.scrollTop = overlay.scrollHeight;
            }, 10);
        }
    });

    // Click anywhere to focus input; links marked data-close-terminal close it
    overlay.addEventListener('click', (e) => {
        if (e.target.closest('[data-close-terminal]')) {
            closeTerminal();
            return;
        }
        input.focus();
    });

    // Trusted, static markup only - use printText for anything user-supplied
    function print(text, className = 'command-output') {
        const line = document.createElement('div');
        line.className = className;
        line.innerHTML = text; // Allow HTML for links
        history.appendChild(line);
    }

    function printText(text, className = 'command-output') {
        const line = document.createElement('div');
        line.className = className;
        line.textContent = text;
        history.appendChild(line);
    }

    function printLinkLine(prefixText, linkText, href, suffixText = '') {
        const line = document.createElement('div');
        line.className = 'command-output';
        if (prefixText) line.appendChild(document.createTextNode(prefixText));

        const link = document.createElement('a');
        link.className = 'terminal-link';
        link.href = href;
        link.textContent = linkText;
        if (/^https?:\/\//i.test(href)) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        } else if (href && href.startsWith('/')) {
            link.dataset.closeTerminal = 'true';
        }
        line.appendChild(link);

        if (suffixText) line.appendChild(document.createTextNode(suffixText));
        history.appendChild(line);
    }

    function printCommand(cmd) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = 'visitor@ethauber.io:~$';
        line.appendChild(prompt);
        line.appendChild(document.createTextNode(` ${cmd}`));
        history.appendChild(line);
    }

    function getStardate() {
        return window.EasterEggUtils
            ? window.EasterEggUtils.computeStardate(new Date())
            : '80000.0';
    }

    function launchOverlayEffect(message, triggerFn) {
        const effectBusy = window.EasterEggUtils && window.EasterEggUtils.effectLock.isActive();
        if (pendingTrekTimer !== null || effectBusy) {
            printText("Stand by: another sequence is already in progress.", "command-error");
            return;
        }
        printText(message);
        if (typeof triggerFn === 'function') {
            const scheduledSession = terminalSessionId;
            pendingTrekTimer = setTimeout(() => {
                pendingTrekTimer = null;
                if (!isOpen || terminalSessionId !== scheduledSession) return;
                closeTerminal();
                triggerFn();
            }, 350);
        }
    }

    function launchTrekEffect(message, triggerName) {
        const eggs = window.StarTrekEasterEggs;
        launchOverlayEffect(
            message,
            eggs && typeof eggs[triggerName] === 'function' ? eggs[triggerName] : null
        );
    }

    function launchRealityFracture(message) {
        const jace = window.RealityFractureEasterEgg;
        launchOverlayEffect(
            message,
            jace && typeof jace.trigger === 'function' ? jace.trigger : null
        );
    }

    const commands = {
        help: () => {
            print("Available commands:");
            print("  <span class='terminal-cmd'>about</span>    - Who am I?");
            print("  <span class='terminal-cmd'>skills</span>   - Technical capabilities");
            print("  <span class='terminal-cmd'>contact</span>  - Get in touch");
            print("  <span class='terminal-cmd'>projects</span> - View works");
            print("  <span class='terminal-cmd'>clear</span>    - Clear the terminal");
            print("  <span class='terminal-cmd'>exit</span>     - Close terminal");
            print("  <span class='terminal-cmd'>sudo</span>     - ...don't");
            print("  <span class='terminal-cmd'>computer</span> - Starfleet LCARS interface");
            print("  <span class='terminal-cmd'>echoverse</span> - Reality Fracture surveillance node");
        },
        about: () => {
            const about = (window.TerminalData && window.TerminalData.about) || {};
            const role = about.role || 'Software Engineer';
            const years = about.yearsExperience || 8;
            printText(about.name || 'Elijah Hauber');
            printText(`${role} with ${years} years of experience.`);
            printText(`Specializing in: ${about.specialties || 'Maintenance, Architecture, Prototypes, Research, Documentation, and Testing'}.`);
            if (about.latestOrg !== '') printText(`Formerly at ${about.latestOrg || 'Parus Holdings LLC'}.`);
            if (about.educationOrg !== '') printText(`${about.educationOrg || 'Purdue University'} CS Graduate.`);
        },
        skills: () => {
            const groups = (window.TerminalData && Array.isArray(window.TerminalData.skills)) ? window.TerminalData.skills : [];
            if (!groups.length) {
                printText('Skills data unavailable.');
                return;
            }
            groups.forEach((group) => {
                printText(`${group.category.toUpperCase()}: ${(group.items || []).join(', ')}`);
            });
        },
        contact: () => {
            const contact = (window.TerminalData && window.TerminalData.contact) || {};
            const email = contact.email || 'ethauber@outlook.com';
            const socials = Array.isArray(contact.socials) ? contact.socials : [];
            printLinkLine('Email: ', email, `mailto:${email}`);
            socials.forEach((social) => {
                printLinkLine(`${social.name}: `, social.label || social.url, social.url);
            });
        },
        projects: () => {
            const projects = (window.TerminalData && Array.isArray(window.TerminalData.projects)) ? window.TerminalData.projects : [];
            printText('Checking ./works directory...');
            projects.forEach((item) => {
                const suffix = Array.isArray(item.tags) && item.tags.length ? ` (${item.tags.join(', ')})` : '';
                printLinkLine('- ', item.name, item.url, suffix);
            });
        },
        clear: () => {
            history.innerHTML = '';
        },
        exit: () => {
            closeTerminal();
        },
        sudo: () => {
            print("admin@ethauber.io: Permission denied.", "command-error");
            print("Nice try. 😉");
        },
        ls: () => {
            print("about.txt  contact.md  skills.json  stardate.log  projects/  _secrets/");
        },
        whoami: () => {
            print("visitor");
        },
        date: () => {
            print(new Date().toString());
        },
        stardate: () => {
            printText(`Stardate ${getStardate()}`);
        },
        tea: () => {
            printText("Replicating: Tea. Earl Grey. Hot. ☕");
        },
        computer: () => {
            printText("LCARS Library Computer Access/Retrieval System online.");
            print("  <span class='terminal-cmd'>stardate</span>  - Current Starfleet stardate");
            print("  <span class='terminal-cmd'>lcars</span>     - Ship telemetry (add 'hud' for overlay)");
            print("  <span class='terminal-cmd'>engage</span>    - Warp to /space/ (Sector 001)");
            print("  <span class='terminal-cmd'>warp</span>      - Engage warp drive on current page");
            print("  <span class='terminal-cmd'>redalert</span>  - Raise shields and sound Red Alert");
            print("  <span class='terminal-cmd'>beam</span>      - Energize transporter (alias: energize)");
            print("  <span class='terminal-cmd'>tea</span>       - Replicate Captain's beverage");
            print("  <span class='terminal-cmd'>kobayashi</span> - Load Academy command test");
        },
        lcars: (args) => {
            if (args && args[0] && args[0].toLowerCase() === 'hud') {
                launchTrekEffect("LCARS HUD initialized.", "triggerLcars");
                return;
            }
            printText(
                `LCARS 47634 // USS ENTERPRISE NCC-1701-D\n` +
                `STARDATE : ${getStardate()}\n` +
                `SECTOR   : 001 (ORION SPUR/ARM)\n` +
                `WARP CORE: NOMINAL // SHIELDS: 100%`,
                "terminal-lcars"
            );
        },
        engage: () => {
            launchTrekEffect("Helm: Course laid in for Sector 001. Ahead warp factor 9.975. Engage!", "triggerEngage");
        },
        warp: () => {
            launchTrekEffect("Helm: Ahead warp factor 9.975.", "triggerWarp");
        },
        redalert: () => {
            launchTrekEffect("Tactical: Shields up! All hands to battlestations!", "triggerRedAlert");
        },
        beam: () => {
            launchTrekEffect("Transporter Room: Coordinates locked. Energizing...", "triggerTransporter");
        },
        energize: () => {
            commands.beam();
        },
        kobayashi: () => {
            printText("Simulation loaded: Kobayashi Maru.", "terminal-lcars");
            print("Warning: No-win scenario detected. (Unless you reprogram the simulation...)", "command-error");
        },
        echoverse: () => {
            printText(
                "REALITY FRACTURE // ECHOVERSE ARCHITECT\n" +
                "SUBJECT   : Jace Beleren, The Theorist\n" +
                "EMPATHY   : LOCKED // SANITIZED REALITY ACTIVE\n" +
                "DIRECTIVE : MONITOR // ERASE // OVERWRITE\n" +
                "Run 'theorist' or 'fracture' to manifest prism lattices.",
                "terminal-jace"
            );
        },
        jace: () => {
            launchRealityFracture("The Theorist: Weaving kaleidoscopic prism lattices...");
        },
        theorist: () => {
            commands.jace();
        },
        fracture: () => {
            commands.jace();
        },
        cat: (args) => {
            if (!args || args.length === 0) {
                print("Usage: cat <filename>");
                return;
            }
            const file = args[0];
            if (file === 'about.txt') commands.about();
            else if (file === 'contact.md') commands.contact();
            else if (file === 'skills.json') commands.skills();
            else if (file === 'stardate.log') printText(`Captain's Log, Stardate ${getStardate()}. Exploring the Orion Spur.`, "terminal-lcars");
            else if (file === '_secrets/' || file === '_secrets') print("Access Denied: Biometric scan required.", "command-error");
            else printText(`cat: ${file}: No such file or directory`, "command-error");
        }
    };

    function processCommand(inputString) {
        printCommand(inputString);
        const parts = inputString.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (commands[cmd]) {
            commands[cmd](args);
        } else {
            printText(`Command not found: ${cmd}. Type 'help' for list.`, "command-error");
        }
    }
});

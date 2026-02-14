document.addEventListener('DOMContentLoaded', () => {
    // Inject Terminal HTML
    const terminalHTML = `
        <div id="terminal-overlay">
            <div class="terminal-content">
                <div class="terminal-header">
                    <pre>
  _____ _ _   _       _       
 | ____| (_) (_) __ _| |__    
 |  _| | | | | |/ _` | '_ \   
 | |___| | | | | (_| | | | |  
 |_____|_|_|_/ |\__,_|_| |_|  
           |__/               
                    </pre>
                    <p>Elijah Hauber Interactive Terminal [Version 1.0.0]</p>
                    <p>Type 'help' for available commands.</p>
                </div>
                <div id="terminal-history"></div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">visitor@ethauber.io:~$</span>
                    <input type="text" id="terminal-input" autocomplete="off" spellcheck="false">
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', terminalHTML);

    const overlay = document.getElementById('terminal-overlay');
    const input = document.getElementById('terminal-input');
    const history = document.getElementById('terminal-history');
    let isOpen = false;

    // Toggle Terminal
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            // Prevent default only if we are not typing in a normal input
            // But for this global toggle, we usually want to prevent ` from being typed if it opens the terminal
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
        overlay.classList.add('open');
        input.focus();
        isOpen = true;
        document.body.style.overflow = 'hidden'; // Lock scroll
    }

    function closeTerminal() {
        overlay.classList.remove('open');
        isOpen = false;
        document.body.style.overflow = ''; // Unlock scroll
        input.value = '';
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
            const content = document.querySelector('.terminal-content');
            // Timeout to allow DOM update
            setTimeout(() => {
                overlay.scrollTop = overlay.scrollHeight;
            }, 10);
        }
    });

    // Click anywhere to focus input
    overlay.addEventListener('click', () => {
        input.focus();
    });

    function print(text, className = 'command-output') {
        const line = document.createElement('div');
        line.className = className;
        line.innerHTML = text; // Allow HTML for links
        history.appendChild(line);
    }

    function printCommand(cmd) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="terminal-prompt">visitor@ethauber.io:~$</span> ${cmd}`;
        history.appendChild(line);
    }

    const commands = {
        help: () => {
            print("Available commands:");
            print("  <span style='color:#fff'>about</span>    - Who am I?");
            print("  <span style='color:#fff'>skills</span>   - Technical capabilities");
            print("  <span style='color:#fff'>contact</span>  - Get in touch");
            print("  <span style='color:#fff'>projects</span> - View works");
            print("  <span style='color:#fff'>clear</span>    - Clear the terminal");
            print("  <span style='color:#fff'>exit</span>     - Close terminal");
            print("  <span style='color:#fff'>sudo</span>     - ...don't");
        },
        about: () => {
            print("Elijah Hauber");
            print("Software Engineer with 7 years of experience.");
            print("Specializing in: Maintenance, Architecture, Prototypes, Research, Documentation, and Testing.");
            print("Formerly at Parus Holdings LLC.");
            print("Purdue University CS Graduate.");
        },
        skills: () => {
            print("LANGUAGES: Python, JavaScript, Java, C, C++, C#, HTML, CSS");
            print("CLOUD: AWS (EC2, Lambda, S3, etc.), Terraform, Docker");
            print("DATA: MongoDB, SAP ASE, PostgreSQL, Apache Spark");
            print("TOOLS: Git, Vim, VS Code, Cursor, Postman");
            print("AI: OpenAI API, Anthropic, LangChain, RAG");
        },
        contact: () => {
            print("Email: <a href='mailto:ethauber@outlook.com' class='terminal-link'>ethauber@outlook.com</a>");
            print("LinkedIn: <a href='https://www.linkedin.com/in/ethauber' class='terminal-link' target='_blank'>linkedin.com/in/ethauber</a>");
            print("GitHub: <a href='https://github.com/ethauber' class='terminal-link' target='_blank'>github.com/ethauber</a>");
        },
        projects: () => {
            print("Checking ./works directory...");
            print("- <a href='#works' class='terminal-link' onclick='document.querySelector(\"#terminal-overlay\").classList.remove(\"open\");'>Pong</a> (Game)");
            print("- <a href='#works' class='terminal-link' onclick='document.querySelector(\"#terminal-overlay\").classList.remove(\"open\");'>Flappy Flyer</a> (Game)");
            print("- <a href='#works' class='terminal-link' onclick='document.querySelector(\"#terminal-overlay\").classList.remove(\"open\");'>Mandelbrot/Julia Sets</a> (Math/Art)");
            print("- <a href='/arcana' class='terminal-link'>Arcana Quiz</a> (App)");
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
            print("about.txt  contact.md  skills.json  projects/  _secrets/");
        },
        whoami: () => {
            print("visitor");
        },
        date: () => {
            print(new Date().toString());
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
            else if (file === '_secrets/' || file === '_secrets') print("Access Denied: Biometric scan required.", "command-error");
            else print(`cat: ${file}: No such file or directory`, "command-error");
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
            print(`Command not found: ${cmd}. Type 'help' for list.`, "command-error");
        }
    }
});

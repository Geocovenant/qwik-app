import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';
import { Link } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
    useStylesScoped$(`
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      padding: 1rem;
      background-color: #1a2639;
      background-image: radial-gradient(circle at 50% 50%, #1a2639 0%, #101520 100%);
      color: #fff;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #fff;
      background-image: linear-gradient(to right, #713fc2, #8255c9);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      color: #a7b6c2;
      max-width: 600px;
    }

    .home-link {
      background-color: #713fc2;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.3s;
      border: none;
      box-shadow: 0 4px 6px rgba(113, 63, 194, 0.25);
    }

    .home-link:hover {
      background-color: #8255c9;
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(113, 63, 194, 0.3);
    }

    .svg-container {
      width: 320px;
      height: 320px;
      margin-bottom: 1rem;
      position: relative;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    @keyframes satelliteMove {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(5px); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }

    @keyframes cloudMove {
      0% { transform: translateX(0); }
      50% { transform: translateX(3px); }
      100% { transform: translateX(0); }
    }

    .earth {
      animation: pulse 8s ease-in-out infinite;
      filter: drop-shadow(0 0 10px rgba(113, 63, 194, 0.3));
    }

    .moon {
      animation: float 8s ease-in-out infinite;
    }

    .satellite {
      animation: satelliteMove 5s ease-in-out infinite;
    }

    .cloud {
      animation: cloudMove 7s ease-in-out infinite;
    }

    .error-text {
      font-size: 3.5rem;
      font-weight: bold;
      opacity: 0.8;
      margin-top: 0.5rem;
      color: #8b8b9a;
    }
  `);

    return (
        <div class="error-container">
            <div class="svg-container">
                <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
                    {/* Orbit - Now static, without animation */}
                    <ellipse cx="120" cy="120" rx="90" ry="30"
                        fill="none" stroke="#3498db" stroke-width="0.5"
                        stroke-dasharray="2 3" stroke-opacity="0.6" />

                    {/* Moon */}
                    <circle class="moon" cx="50" cy="80" r="15" fill="#ecf0f1" />
                    <circle cx="45" cy="75" r="3" fill="#bdc3c7" opacity="0.7" />
                    <circle cx="55" cy="85" r="4" fill="#bdc3c7" opacity="0.5" />

                    {/* Planet Earth */}
                    <g class="earth">
                        {/* Base of the planet */}
                        <circle cx="120" cy="120" r="60" fill="#1d66aa" stroke="#3498db" stroke-width="1" />

                        {/* Continents */}
                        <path d="M100,85 Q120,75 135,85 Q150,95 145,115 Q140,135 115,130 Q90,125 100,85"
                            fill="#27ae60" />
                        <path d="M85,105 Q95,95 105,105 Q115,115 105,125 Q95,135 85,105"
                            fill="#27ae60" />
                        <path d="M120,140 Q135,135 145,145 Q155,155 145,165 Q135,175 120,140"
                            fill="#27ae60" />

                        {/* Clouds */}
                        <path class="cloud" d="M95,90 Q105,85 110,90 Q115,95 105,97 Q95,99 95,90"
                            fill="rgba(255,255,255,0.5)" />
                        <path class="cloud" d="M130,100 Q140,95 145,100 Q150,105 140,107 Q130,109 130,100"
                            fill="rgba(255,255,255,0.5)" style="animation-delay: -1s" />
                        <path class="cloud" d="M90,120 Q100,115 105,120 Q110,125 100,127 Q90,129 90,120"
                            fill="rgba(255,255,255,0.5)" style="animation-delay: -2s" />
                        <path class="cloud" d="M120,150 Q130,145 135,150 Q140,155 130,157 Q120,159 120,150"
                            fill="rgba(255,255,255,0.5)" style="animation-delay: -3s" />
                    </g>

                    {/* Satellite - Repositioned correctly */}
                    <g class="satellite">
                        <rect x="180" y="115" width="16" height="6" fill="#95a5a6" rx="1" />
                        <rect x="186" y="110" width="4" height="16" fill="#95a5a6" rx="1" />
                    </g>
                </svg>
            </div>

            <div class="error-text">404</div>

            <h1>{_`Page not found`}</h1>
            <p>{_`Sorry, the route you are looking for does not exist or has been moved to another location.`}</p>
            <Link href="/" class="home-link">{_`Return to home`}</Link>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Page not found | Geounity",
    meta: [
        {
            name: "description",
            content: "Sorry, the page you are looking for does not exist or has been moved.",
        },
        {
            name: "robots",
            content: "noindex, nofollow"
        }
    ],
};

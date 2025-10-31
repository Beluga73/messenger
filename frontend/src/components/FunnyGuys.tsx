"use client";

import { useEffect, useRef } from "react";

export const FunnyGuys = () => {
  const groupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!groupRef.current) throw new Error("Group for guys didn't render");

    const trackEyes = (event: MouseEvent) => {
      const pupils = groupRef.current!.querySelectorAll(
        ".pupil"
      ) as NodeListOf<HTMLDivElement>;

      if (pupils.length === 0) throw new Error("Cannot select pupils");

      pupils.forEach((pupil) => {
        // if the pupil got rendered then parent will be as well
        const eye = pupil.parentElement!;
        const eyeRect = eye.getBoundingClientRect();

        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        const dx = event.pageX - eyeCenterX;
        const dy = event.pageY - eyeCenterY;

        const radian = Math.atan2(dy, dx);

        // Pupil moves up to 35% of the eye socket radius
        const maxDistance = eye.clientWidth * 0.35;

        // Clamp distance to prevent pupil leaving the socket
        const distance = Math.min(maxDistance, Math.sqrt(dx * dx + dy * dy));

        const pupilX = distance * Math.cos(radian);
        const pupilY = distance * Math.sin(radian);

        // Apply the translation directly to the DOM element
        pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
      });
    };

    document.addEventListener("mousemove", trackEyes);

    return () => {
      document.removeEventListener("mousemove", trackEyes);
    };
  }, []);

  return (
    <>
      <style>{`
        .shape {
          animation: float 5s ease-in-out infinite;
          padding-top: 20px;
        }
        .yellow-bird {
          border-top-left-radius: 40px;
          border-top-right-radius: 40px;
        }
        .yellow-bird .beak {
          position: absolute;
          width: 60px;
          height: 5px;
          background: #000;
          top: 40px;
          right: -30px;
        }
        .orange-semi {
          border-radius: 90px 90px 0 0;
          padding-top: 40px;
          animation-delay: -2.5s;
        }
        .orange-semi .eyes-cont {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 50%;
        }
        .orange-semi .mouth {
          position: absolute;
          width: 25px;
          height: 12px;
          background: #000;
          border-radius: 0 0 12px 12px;
          top: 65px;
          left: 77px;
        }
        .orange-semi .smile {
          position: absolute;
          width: 20px;
          height: 10px;
          background: #fff;
          border-radius: 0 0 10px 10px;
          top: 65px;
          left: 80px;
        }
        .eyes-cont {
          display: flex;
          width: 100%;
          justify-content: space-around;
          align-items: flex-start;
        }
        .eye-socket {
          position: relative;
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 10px;
          height: 10px;
        }
        .black-rect .eye-socket {
          width: 14px;
          height: 14px;
        }
        .yellow-bird .eye-socket {
          left: -10px;
        }
        .pupil {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #000;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: transform 0.1s;
        }
        .black-rect .pupil {
          width: 6px;
          height: 6px;
        }
        .yellow-bird .pupil {
          width: 3px;
          height: 3px;
        }

      `}</style>

      <div className="relative flex w-76 aspect-square" ref={groupRef}>
        {/* 1. Orange Semicircle */}
        <div className="shape orange-semi absolute bottom-0 bg-[#ff9933] w-[180px] h-[90px] z-10">
          <div className="eyes-cont">
            <div className="eye-socket">
              <div className="pupil"></div>
            </div>
            <div className="eye-socket">
              <div className="pupil"></div>
            </div>
          </div>
          <div className="mouth"></div>
        </div>

        {/* 2. Purple Rectangle */}
        <div className="shape purple-rect absolute bottom-0 bg-[#5500ff] w-[100px] h-[300px] left-[20px]">
          <div className="eyes-cont">
            <div className="eye-socket">
              <div className="pupil"></div>
            </div>
            <div className="eye-socket">
              <div className="pupil"></div>
            </div>
          </div>
        </div>

        {/* 3. Black Rectangle */}
        <div className="shape black-rect absolute bottom-0 bg-black w-[90px] h-[220px] left-[100px]">
          <div className="eyes-cont">
            <div className="eye-socket">
              <div className="pupil"></div>
            </div>
            <div className="eye-socket">
              <div className="pupil"></div>
            </div>
          </div>
        </div>

        {/* 4. Yellow Rounded Bird */}
        <div className="shape yellow-bird absolute bottom-0 bg-[#ffcc00] w-[80px] h-[130px] left-[170px]">
          <div className="eyes-cont">
            <div className="eye-socket">
              <div className="pupil"></div>
            </div>
          </div>
          <div className="beak"></div>
        </div>
      </div>
    </>
  );
};

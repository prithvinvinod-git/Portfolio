"use strict";

      if (window.gsap && window.ScrollTrigger)
        gsap.registerPlugin(ScrollTrigger);

      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      function dbc(fn, ms) {
        let t;
        return (...a) => {
          clearTimeout(t);
          t = setTimeout(() => fn(...a), ms);
        };
      }

      const rm = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

      const mobile = () => window.innerWidth < 900;

      const LC = {
        JavaScript: "#f7df1e",
        Python: "#3572a5",
        C: "#777",

        "C++": "#f34b7d",
        HTML: "#e34c26",
        CSS: "#563d7c",

        TypeScript: "#2b7489",
        Arduino: "#00979d",
        Shell: "#89e051",
      };

      (() => {
        const dot = document.getElementById("cd");

        const ring = document.getElementById("cr");

        if (!dot || window.matchMedia("(pointer:coarse)").matches) return;

        let mx = -200,
          my = -200,
          rx = -200,
          ry = -200;

        document.addEventListener("mousemove", (e) => {
          mx = e.clientX;
          my = e.clientY;

          dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
        });

        (function tick() {
          rx = lerp(rx, mx, 0.13);
          ry = lerp(ry, my, 0.13);

          ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;

          requestAnimationFrame(tick);
        })();

        document.addEventListener("mouseover", (e) => {
          if (e.target.closest("a,button,.pill,.card,.rp,.cc,.dot"))
            document.body.classList.add("ch");
        });

        document.addEventListener("mouseout", (e) => {
          if (e.target.closest("a,button,.pill,.card,.rp,.cc,.dot"))
            document.body.classList.remove("ch");
        });
      })();

      (() => {
        const nav = document.getElementById("nav");

        const hbg = document.getElementById("hbg");

        const drw = document.getElementById("drw");

        setTimeout(() => nav.classList.add("vis"), 350);

        hbg.addEventListener("click", () => {
          const o = drw.classList.toggle("o");

          hbg.classList.toggle("o", o);

          hbg.setAttribute("aria-expanded", o);
        });

        drw.querySelectorAll("a").forEach((a) =>
          a.addEventListener("click", () => {
            drw.classList.remove("o");
            hbg.classList.remove("o");
          }),
        );

        const sids = ["hero", "exp", "proj", "esp32", "contact"];

        const nls = document.querySelectorAll("[data-n]");

        const dots = document.querySelectorAll(".dot");

        function setAct(id) {
          nls.forEach((a) => a.classList.toggle("on", a.dataset.n === id));

          dots.forEach((d) => d.classList.toggle("on", d.dataset.s === id));
        }

        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) setAct(e.target.id);
            });
          },
          { threshold: 0.3 },
        );

        sids.forEach((id) => {
          const el = document.getElementById(id);
          if (el) io.observe(el);
        });

        dots.forEach((d) => {
          d.addEventListener("click", () => {
            const el = document.getElementById(d.dataset.s);

            if (el) el.scrollIntoView({ behavior: "smooth" });
          });
        });

        const stt = document.getElementById("stt");

        window.addEventListener(
          "scroll",
          () => stt.classList.toggle("vis", scrollY > 400),
          { passive: true },
        );

        stt.addEventListener("click", () =>
          window.scrollTo({ top: 0, behavior: "smooth" }),
        );
      })();

      (() => {
        const el = document.getElementById("tw");

        if (!el) return;

        const txt = "Building the future, one line of code at a time.";

        let i = 0;

        function type() {
          el.textContent = txt.slice(0, i++);

          if (i <= txt.length) setTimeout(type, 40);
          else
            setTimeout(() => {
              const tc = document.getElementById("tc");
              if (tc) tc.style.opacity = ".4";
            }, 2000);
        }

        setTimeout(type, rm ? 0 : 800);
      })();

      (() => {
        const els = document.querySelectorAll(".rv,.rv-l,.rv-r");

        if (rm) {
          els.forEach((e) => e.classList.add("in"));
          return;
        }

        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e, i) => {
              if (e.isIntersecting) {
                setTimeout(
                  () => e.target.classList.add("in"),
                  e.target.dataset.d || 0,
                );

                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.12 },
        );

        document.querySelectorAll(".sec,.hl").forEach((parent) => {
          const kids = [...parent.querySelectorAll(".rv,.rv-l,.rv-r")];

          kids.forEach((k, i) => (k.dataset.d = i * 80));
        });

        els.forEach((el) => io.observe(el));
      })();

      (() => {
        const GH = "prithvinvinod-git";

        Promise.all([
          fetch(`https://api.github.com/users/${GH}`).then((r) => r.json()),

          fetch(
            `https://api.github.com/users/${GH}/repos?per_page=100&sort=updated`,
          ).then((r) => r.json()),
        ])
          .then(([u, repos]) => {
            if (!Array.isArray(repos)) throw 0;

            const stars = repos.reduce(
              (a, r) => a + (r.stargazers_count || 0),
              0,
            );

            const forks = repos.reduce((a, r) => a + (r.forks_count || 0), 0);

            const lc = {};

            repos.forEach((r) => {
              if (r.language) lc[r.language] = (lc[r.language] || 0) + 1;
            });

            const langs = Object.entries(lc)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5);

            const mx = langs[0]?.[1] || 1;

            const pinned = repos
              .sort((a, b) => b.stargazers_count - a.stargazers_count)
              .slice(0, 4);

            document.getElementById("gh-g").innerHTML = `

      <div class="ghc"><span class="ghn">${u.public_repos}</span><span class="ghl">Repos</span></div>

      <div class="ghc"><span class="ghn">${stars}</span><span class="ghl">Stars</span></div>

      <div class="ghc"><span class="ghn">${forks}</span><span class="ghl">Forks</span></div>

    `;

            document.getElementById("lbs").innerHTML = langs
              .map(([l, c]) => {
                const p = Math.round((c / mx) * 100);

                const cl = LC[l] || "#888";

                return `<div class="lb">

        <div class="lbh"><span style="color:${cl}">${l}</span><span style="color:var(--dim)">${c}</span></div>

        <div class="lbt"><div class="lbf" style="background:${cl}" data-w="${p}"></div></div>

      </div>`;
              })
              .join("");

            document.getElementById("rps").innerHTML = pinned
              .map(
                (r) => `

      <a href="${r.html_url}" target="_blank" rel="noopener" class="rp">

        <div class="rpn">${r.name}</div>

        <div class="rpd">${(r.description || "No description").slice(0, 80)}${(r.description || "").length > 80 ? " €¦" : ""}</div>

        <div class="rpm">

          ${r.language ? `<span style="color:${LC[r.language] || "#888"}">  ${r.language}</span>` : ""}

          <span>★ ${r.stargazers_count}</span>

        </div>

      </a>`,
              )
              .join("");

            document.getElementById("gh-sk").style.display = "none";

            document.getElementById("gh-data").style.display = "block";

            setTimeout(() => {
              document
                .querySelectorAll(".lbf")
                .forEach((el) => (el.style.width = el.dataset.w + "%"));
            }, 400);
          })
          .catch(() => {
            document.getElementById("gh-sk").innerHTML =
              `<p style="font-family:var(--fm);font-size:.8rem;color:var(--dim)">GitHub stats unavailable (rate limited). <a href="https://github.com/prithvinvinod-git" target="_blank" style="color:var(--a)">View on GitHub  †’</a></p>`;
          });
      })();

      (() => {
        const canvas = document.getElementById("hero-c");

        if (!canvas || !window.THREE) return;

        function W() {
          return canvas.clientWidth;
        }

        function H() {
          return canvas.clientHeight;
        }

        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
        });

        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

        renderer.setSize(W(), H());

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 100);

        camera.position.z = 6;

        scene.add(new THREE.AmbientLight(0x0c0c0c, 6));

        const pl1 = new THREE.PointLight(0xe8a020, 3, 20);
        pl1.position.set(4, 4, 4);
        scene.add(pl1);

        const pl2 = new THREE.PointLight(0xf97316, 1.5, 15);
        pl2.position.set(-4, -2, 2);
        scene.add(pl2);

        const pl3 = new THREE.PointLight(0xffffff, 0.5, 10);
        pl3.position.set(0, 5, -2);
        scene.add(pl3);

        const group = new THREE.Group();

        const geo = new THREE.IcosahedronGeometry(2, 2);

        const mat = new THREE.MeshPhongMaterial({
          color: 0x0c0c0c,
          emissive: 0xe8a020,
          emissiveIntensity: 0.06,

          shininess: 140,
          specular: 0xe8a020,
        });

        const mesh = new THREE.Mesh(geo, mat);

        group.add(mesh);

        const wgeo = new THREE.IcosahedronGeometry(2, 1);
        const wire = new THREE.Mesh(
          wgeo,
          new THREE.MeshBasicMaterial({
            color: 0xe8a020,
            wireframe: true,
            transparent: true,
            opacity: 0.25,
          }),
        );

        group.add(wire);

        const wire2 = new THREE.Mesh(
          wgeo,
          new THREE.MeshBasicMaterial({
            color: 0xf97316,
            wireframe: true,
            transparent: true,
            opacity: 0.08,
          }),
        );

        wire2.scale.setScalar(1.08);

        group.add(wire2);

        const ptPos = new Float32Array(250 * 3);

        for (let i = 0; i < 250; i++) {
          const r = 2.8 + Math.random() * 1.8;

          const theta = Math.random() * Math.PI * 2;

          const phi = Math.acos(2 * Math.random() - 1);

          ptPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);

          ptPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);

          ptPos[i * 3 + 2] = r * Math.cos(phi);
        }

        const ptGeo = new THREE.BufferGeometry();

        ptGeo.setAttribute("position", new THREE.BufferAttribute(ptPos, 3));

        group.add(
          new THREE.Points(
            ptGeo,
            new THREE.PointsMaterial({
              color: 0xe8a020,
              size: 0.04,
              transparent: true,
              opacity: 0.5,
            }),
          ),
        );

        scene.add(group);

        let tRx = 0,
          tRy = 0,
          cRx = 0,
          cRy = 0;

        window.addEventListener(
          "mousemove",
          (e) => {
            tRy = (e.clientX / window.innerWidth - 0.5) * 0.5;

            tRx = -(e.clientY / window.innerHeight - 0.5) * 0.3;
          },
          { passive: true },
        );

        if (!rm) {
          group.scale.setScalar(0.01);

          gsap.to(group.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.4,
            ease: "elastic.out(1,.75)",
            delay: 0.4,
          });
        }

        let t = 0;

        function animate() {
          requestAnimationFrame(animate);

          t += 0.006;

          group.rotation.y += 0.004;

          group.rotation.x += 0.002;

          cRx = lerp(cRx, tRx, 0.025);

          cRy = lerp(cRy, tRy, 0.025);

          group.rotation.x += cRx * 0.015;

          group.rotation.y += cRy * 0.015;

          group.position.y = Math.sin(t) * 0.1;

          mat.emissiveIntensity = 0.05 + Math.sin(t * 1.8) * 0.03;

          renderer.render(scene, camera);
        }

        animate();

        window.addEventListener(
          "resize",
          dbc(() => {
            renderer.setSize(W(), H());

            camera.aspect = W() / H();

            camera.updateProjectionMatrix();
          }, 200),
        );
      })();

      (() => {
        const canvas = document.getElementById("c-gh");

        if (!canvas || !window.THREE) return;

        let paused = mobile();

        let ready = false,
          group = null;

        function init() {
          if (ready) return;
          ready = true;

          function W() {
            return canvas.clientWidth;
          }

          function H() {
            return canvas.clientHeight;
          }

          const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
          });

          renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

          renderer.setSize(W(), H());

          const scene = new THREE.Scene();

          const camera = new THREE.PerspectiveCamera(44, W() / H(), 0.1, 100);

          camera.position.set(0, 3.5, 9);

          camera.lookAt(0, 0.5, 0);

          scene.add(new THREE.AmbientLight(0x0c0c0c, 4));

          const pl1 = new THREE.PointLight(0xe8a020, 2.5, 22);
          pl1.position.set(4, 6, 4);
          scene.add(pl1);

          const pl2 = new THREE.PointLight(0xf97316, 1.2, 16);
          pl2.position.set(-4, 2, 2);
          scene.add(pl2);

          group = new THREE.Group();

          const COLS = 11,
            ROWS = 7,
            SP = 0.5;

          for (let c = 0; c < COLS; c++) {
            for (let r = 0; r < ROWS; r++) {
              const h = Math.random() * 1.8 + 0.06;

              const act = h / 1.86;

              const col = new THREE.Color().lerpColors(
                new THREE.Color(0x1c1c1c),

                new THREE.Color(0xe8a020),

                act,
              );

              const m = new THREE.Mesh(
                new THREE.BoxGeometry(0.38, h, 0.38),

                new THREE.MeshPhongMaterial({
                  color: col,
                  emissive: col,
                  emissiveIntensity: 0.15 * act,
                }),
              );

              m.position.set(
                (c - COLS / 2) * SP,
                h / 2 - 0.4,
                (r - ROWS / 2) * SP,
              );

              group.add(m);
            }
          }

          const gd = new THREE.GridHelper(6, 14, 0x252525, 0x252525);

          gd.position.y = -0.4;

          group.add(gd);

          scene.add(group);

          group.position.x = 16;

          group.rotation.y = -0.5;

          if (window.ScrollTrigger) {
            ScrollTrigger.create({
              trigger: "#exp",

              start: "top bottom",

              end: "top 15%",

              scrub: 1.2,

              onUpdate(self) {
                if (!group) return;

                group.position.x = lerp(16, 1.2, self.progress);

                group.rotation.y = lerp(-0.5, -0.05, self.progress);
              },
            });
          }

          let t = 0;

          (function animate() {
            requestAnimationFrame(animate);
            if (paused) return;

            t += 0.003;

            if (group) group.rotation.y += 0.003;

            renderer.render(scene, camera);
          })();

          window.addEventListener(
            "resize",
            dbc(() => {
              paused = mobile();
              if (!paused) {
                renderer.setSize(W(), H());
                camera.aspect = W() / H();
                camera.updateProjectionMatrix();
              }
            }, 200),
          );
        }

        const obs = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              obs.disconnect();
              init();
            }
          },
          { rootMargin: "600px" },
        );

        obs.observe(document.getElementById("exp"));
      })();

      (() => {
        const canvas = document.getElementById("c-lp");

        if (!canvas || !window.THREE) return;

        let paused = mobile();

        let ready = false,
          group = null,
          mixer = null;

        const clock = new THREE.Clock();

        function init() {
          if (ready) return;
          ready = true;

          function W() {
            return canvas.clientWidth;
          }

          function H() {
            return canvas.clientHeight;
          }

          const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
          });

          renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

          renderer.setSize(W(), H());

          renderer.outputEncoding = THREE.sRGBEncoding;

          renderer.physicallyCorrectLights = true;

          const scene = new THREE.Scene();

          const camera = new THREE.PerspectiveCamera(40, W() / H(), 0.1, 100);

          camera.position.set(0, 1.8, 7);

          camera.lookAt(0, 0.2, 0);

          scene.add(new THREE.AmbientLight(0xffffff, 0.6));

          const key = new THREE.DirectionalLight(0xe8a020, 2);
          key.position.set(5, 6, 5);
          scene.add(key);

          const fill = new THREE.DirectionalLight(0xffffff, 0.8);
          fill.position.set(-4, 3, 2);
          scene.add(fill);

          const rim = new THREE.DirectionalLight(0xf97316, 0.5);
          rim.position.set(0, -4, -4);
          scene.add(rim);

          scene.add(new THREE.HemisphereLight(0x1a1a1a, 0x0c0c0c, 1));

          group = new THREE.Group();

          scene.add(group);

          const spinGeo = new THREE.TorusGeometry(0.4, 0.05, 12, 40);

          const spinMat = new THREE.MeshBasicMaterial({
            color: 0xe8a020,
            transparent: true,
            opacity: 0.7,
          });

          const spinner = new THREE.Mesh(spinGeo, spinMat);

          scene.add(spinner);

          const loader = new THREE.GLTFLoader();

          loader.load(
            "../assets/models/gaming_laptop.glb",

            (gltf) => {
              scene.remove(spinner);

              const model = gltf.scene;

              const box = new THREE.Box3().setFromObject(model);

              const size = box.getSize(new THREE.Vector3());

              const centre = box.getCenter(new THREE.Vector3());

              const maxDim = Math.max(size.x, size.y, size.z);

              const targetSize = 3.24;
              const s = targetSize / maxDim;

              model.scale.setScalar(s);

              model.position.set(
                -centre.x * s,
                -box.min.y * s - 0.1,
                -centre.z * s,
              );

              model.traverse((n) => {
                if (n.isMesh) {
                  n.castShadow = true;

                  n.receiveShadow = true;

                  if (n.material) {
                    n.material.envMapIntensity = 0.4;
                  }
                }
              });

              group.add(model);

              if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(model);

                gltf.animations.forEach((clip) => {
                  const action = mixer.clipAction(clip);

                  action.play();
                });
              }

              group.position.set(16, 0, 0);

              group.rotation.y = -2.07;
              if (!rm) {
                gsap.to(group.rotation, {
                  y: -1.75,
                  duration: 1.2,
                  ease: "power3.out",
                  delay: 0.1,
                });
              }

              if (window.ScrollTrigger) {
                ScrollTrigger.create({
                  trigger: "#proj",

                  start: "top bottom",

                  end: "top 15%",

                  scrub: 1.2,

                  onUpdate(self) {
                    if (!group) return;

                    group.position.x = lerp(16, 0.2, self.progress);
                  },
                });
              }
            },

            (xhr) => {
              if (xhr.total) spinner.rotation.z += 0.05;
            },

            (err) => {
              console.warn("gaming_laptop.glb not found, using fallback", err);

              scene.remove(spinner);

              const fb = new THREE.Mesh(
                new THREE.BoxGeometry(3, 0.08, 2),

                new THREE.MeshBasicMaterial({
                  color: 0xe8a020,
                  wireframe: true,
                  transparent: true,
                  opacity: 0.3,
                }),
              );

              group.add(fb);

              group.position.set(16, 0, 0);

              if (window.ScrollTrigger) {
                ScrollTrigger.create({
                  trigger: "#proj",
                  start: "top bottom",
                  end: "top 15%",
                  scrub: 1.2,

                  onUpdate(self) {
                    if (group) group.position.x = lerp(16, 0.2, self.progress);
                  },
                });
              }
            },
          );

          let ft = 0;

          (function animate() {
            requestAnimationFrame(animate);
            if (paused) return;

            ft += 0.009;

            const delta = clock.getDelta();

            if (mixer) mixer.update(delta);

            if (!rm && group) group.position.y = Math.sin(ft) * 0.12 - 0.55;
            if (group && Math.abs(group.position.x) < 4)
              group.rotation.y += 0.003;

            renderer.render(scene, camera);
          })();

          window.addEventListener(
            "resize",
            dbc(() => {
              paused = mobile();
              if (!paused) {
                renderer.setSize(W(), H());
                camera.aspect = W() / H();
                camera.updateProjectionMatrix();
              }
            }, 200),
          );
        }

        const obs = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              obs.disconnect();
              init();
            }
          },
          { rootMargin: "600px" },
        );

        obs.observe(document.getElementById("proj"));
      })();

      (() => {
        const canvas = document.getElementById("c-esp");

        if (!canvas || !window.THREE) return;

        let paused = mobile();

        let ready = false,
          group = null,
          mixer = null;

        const clock = new THREE.Clock();

        function init() {
          if (ready) return;
          ready = true;

          function W() {
            return canvas.clientWidth;
          }

          function H() {
            return canvas.clientHeight;
          }

          const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
          });

          renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

          renderer.setSize(W(), H());

          renderer.outputEncoding = THREE.sRGBEncoding;

          renderer.physicallyCorrectLights = true;

          const scene = new THREE.Scene();

          const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100);

          camera.position.set(0, 2.8, 8);

          camera.lookAt(0, 0, 0);

          scene.add(new THREE.AmbientLight(0xffffff, 0.7));

          const key = new THREE.DirectionalLight(0xffffff, 1.8);
          key.position.set(5, 6, 5);
          scene.add(key);

          const fill = new THREE.DirectionalLight(0x10b981, 1.0);
          fill.position.set(-4, 4, 4);
          scene.add(fill);

          const rim = new THREE.DirectionalLight(0xe8a020, 0.6);
          rim.position.set(0, -3, -3);
          scene.add(rim);

          scene.add(new THREE.HemisphereLight(0x1a3c2a, 0x0c0c0c, 0.8));

          group = new THREE.Group();

          scene.add(group);

          const spinGeo = new THREE.TorusGeometry(0.35, 0.05, 12, 40);

          const spinner = new THREE.Mesh(
            spinGeo,
            new THREE.MeshBasicMaterial({
              color: 0x10b981,
              transparent: true,
              opacity: 0.7,
            }),
          );

          scene.add(spinner);

          const loader = new THREE.GLTFLoader();

          loader.load(
            "../assets/models/esp32.glb",

            (gltf) => {
              scene.remove(spinner);

              const model = gltf.scene;

              const box = new THREE.Box3().setFromObject(model);

              const size = box.getSize(new THREE.Vector3());

              const centre = box.getCenter(new THREE.Vector3());

              const maxDim = Math.max(size.x, size.y, size.z);

              const s = 4.0 / maxDim;

              model.scale.setScalar(s);

              model.position.set(
                -centre.x * s,
                -box.min.y * s - 0.1,
                -centre.z * s,
              );

              model.traverse((n) => {
                if (n.isMesh) {
                  n.castShadow = true;

                  if (n.material) n.material.envMapIntensity = 0.3;
                }
              });

              group.add(model);

              if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(model);

                gltf.animations.forEach((clip) =>
                  mixer.clipAction(clip).play(),
                );
              }

              group.position.set(-18, 0, 0);

              group.rotation.set(0.3, 0.5, 0);

              if (!rm)
                gsap.to(group.rotation, {
                  y: 0.1,
                  x: 0.2,
                  duration: 1.2,
                  ease: "power3.out",
                  delay: 0.1,
                });

              if (window.ScrollTrigger) {
                ScrollTrigger.create({
                  trigger: "#esp32",

                  start: "top bottom",

                  end: "top 15%",

                  scrub: 1.2,

                  onUpdate(self) {
                    if (!group) return;

                    group.position.x = lerp(-18, -1.2, self.progress);
                  },
                });
              }
            },

            null,

            (err) => {
              console.warn("esp32.glb not found, using fallback", err);

              scene.remove(spinner);

              const fb = new THREE.Mesh(
                new THREE.BoxGeometry(4, 0.1, 2.5),

                new THREE.MeshBasicMaterial({
                  color: 0x10b981,
                  wireframe: true,
                  transparent: true,
                  opacity: 0.3,
                }),
              );

              group.add(fb);

              group.position.set(-18, 0, 0);

              if (window.ScrollTrigger) {
                ScrollTrigger.create({
                  trigger: "#esp32",
                  start: "top bottom",
                  end: "top 15%",
                  scrub: 1.2,

                  onUpdate(self) {
                    if (group)
                      group.position.x = lerp(-18, -1.2, self.progress);
                  },
                });
              }
            },
          );

          let ft = 0;

          (function animate() {
            requestAnimationFrame(animate);
            if (paused) return;

            ft += 0.008;

            const delta = clock.getDelta();

            if (mixer) mixer.update(delta);

            if (!rm && group) group.position.y = Math.sin(ft) * 0.1;

            if (group && Math.abs(group.position.x) < 5)
              group.rotation.y += 0.002;

            renderer.render(scene, camera);
          })();

          window.addEventListener(
            "resize",
            dbc(() => {
              paused = mobile();
              if (!paused) {
                renderer.setSize(W(), H());
                camera.aspect = W() / H();
                camera.updateProjectionMatrix();
              }
            }, 200),
          );
        }

        const obs = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              obs.disconnect();
              init();
            }
          },
          { rootMargin: "600px" },
        );

        obs.observe(document.getElementById("esp32"));
      })();

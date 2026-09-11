/* ==========================================================================
   KEDAR CHEMISTRY // 3D SCROLLYTELLING CENTERPIECE (THREE.JS)
   Dynamic Modular Core: Physical (Lattice), Inorganic (Octahedron), Organic (Benzene)
   ========================================================================== */

const cubeCanvas = document.getElementById('web3CubeCanvas');
if (cubeCanvas && typeof THREE !== 'undefined') {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
  camera.position.set(0, 0, 7.8);

  const renderer = new THREE.WebGLRenderer({
    canvas: cubeCanvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(520, 520, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  // Ambient and Key Lighting
  const ambientLight = new THREE.AmbientLight(0x0a0d18, 2.2);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
  dirLight.position.set(4, 6, 5);
  scene.add(dirLight);

  const pointAccent = new THREE.PointLight(0x00f0ff, 3.8, 16);
  pointAccent.position.set(-3.5, 2.5, 4);
  scene.add(pointAccent);

  const pointSecondary = new THREE.PointLight(0xffffff, 1.6, 14);
  pointSecondary.position.set(3.5, -3, -3);
  scene.add(pointSecondary);

  // Master Centerpiece Group
  const centerpiece = new THREE.Group();
  scene.add(centerpiece);

  // Surrounding Floating Particle Field
  const particleGeo = new THREE.BufferGeometry();
  const pCount = 260;
  const pPositions = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i += 3) {
    pPositions[i] = (Math.random() - 0.5) * 14;
    pPositions[i + 1] = (Math.random() - 0.5) * 14;
    pPositions[i + 2] = (Math.random() - 0.5) * 10;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.045,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.55
  });
  const particlesMesh = new THREE.Points(particleGeo, particleMat);
  scene.add(particlesMesh);

  /* ---------------------------------------------------------
     BRANCH 1: PHYSICAL CHEMISTRY (Crystalline Lattice & Waves)
     Accent: Cyan / Electric Blue #00F0FF
     --------------------------------------------------------- */
  const groupPhysical = new THREE.Group();
  centerpiece.add(groupPhysical);

  // Unit cell outer box wireframe
  const latticeBoxGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
  const latticeEdgesGeo = new THREE.EdgesGeometry(latticeBoxGeo);
  const latticeMat = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    linewidth: 2.2,
    transparent: true,
    opacity: 0.95
  });
  const latticeEdgesMesh = new THREE.LineSegments(latticeEdgesGeo, latticeMat);
  groupPhysical.add(latticeEdgesMesh);

  // Inner rotated secondary lattice cage
  const innerBoxGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
  const innerEdgesGeo = new THREE.EdgesGeometry(innerBoxGeo);
  const innerMat = new THREE.LineBasicMaterial({
    color: 0x00c4ff,
    linewidth: 1.5,
    transparent: true,
    opacity: 0.55
  });
  const innerEdgesMesh = new THREE.LineSegments(innerEdgesGeo, innerMat);
  groupPhysical.add(innerEdgesMesh);

  // Corner Lattice Nodes
  const nodeSphGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 0.9,
    roughness: 0.1,
    metalness: 0.85
  });
  const corners = [-1.25, 1.25];
  corners.forEach((x) => {
    corners.forEach((y) => {
      corners.forEach((z) => {
        const sp = new THREE.Mesh(nodeSphGeo, nodeMat);
        sp.position.set(x, y, z);
        groupPhysical.add(sp);
      });
    });
  });

  // Face-centered nodes
  const fcGeo = new THREE.SphereGeometry(0.14, 16, 16);
  const fcPositions = [
    [1.25, 0, 0], [-1.25, 0, 0],
    [0, 1.25, 0], [0, -1.25, 0],
    [0, 0, 1.25], [0, 0, -1.25]
  ];
  fcPositions.forEach(([x, y, z]) => {
    const sp = new THREE.Mesh(fcGeo, nodeMat);
    sp.position.set(x, y, z);
    groupPhysical.add(sp);
  });

  // Rotating kinetic energy wave rings
  const waveRings = [];
  const ringRadii = [1.85, 2.05, 2.25];
  const ringTiltedMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  ringRadii.forEach((r, idx) => {
    const ringGeo = new THREE.TorusGeometry(r, 0.022, 16, 80);
    const ringMesh = new THREE.Mesh(ringGeo, ringTiltedMat);
    if (idx === 1) ringMesh.rotation.x = Math.PI / 3;
    if (idx === 2) ringMesh.rotation.y = Math.PI / 3;
    groupPhysical.add(ringMesh);
    waveRings.push(ringMesh);
  });

  /* ---------------------------------------------------------
     BRANCH 2: INORGANIC CHEMISTRY (Nested Coordination Polyhedron)
     Accent: Amber / Metallic Gold #FFB703
     --------------------------------------------------------- */
  const groupInorganic = new THREE.Group();
  centerpiece.add(groupInorganic);

  const octaGeo = new THREE.OctahedronGeometry(2.35, 0);
  const octaMat = new THREE.MeshStandardMaterial({
    color: 0xffb703,
    emissive: 0xff8c00,
    emissiveIntensity: 0.12,
    metalness: 0.9,
    roughness: 0.18,
    opacity: 0.32,
    transparent: true,
    side: THREE.DoubleSide
  });
  const octaMesh = new THREE.Mesh(octaGeo, octaMat);
  groupInorganic.add(octaMesh);

  const octaEdgesGeo = new THREE.EdgesGeometry(octaGeo);
  const octaEdgesMat = new THREE.LineBasicMaterial({
    color: 0xffe066,
    linewidth: 2.5,
    transparent: true,
    opacity: 0.95
  });
  const octaEdgesMesh = new THREE.LineSegments(octaEdgesGeo, octaEdgesMat);
  groupInorganic.add(octaEdgesMesh);

  const metalCoreGeo = new THREE.SphereGeometry(0.38, 24, 24);
  const metalCoreMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffa500,
    emissiveIntensity: 0.6,
    metalness: 0.95,
    roughness: 0.1
  });
  const metalCoreMesh = new THREE.Mesh(metalCoreGeo, metalCoreMat);
  groupInorganic.add(metalCoreMesh);

  const ligandVertices = [
    new THREE.Vector3(2.35, 0, 0), new THREE.Vector3(-2.35, 0, 0),
    new THREE.Vector3(0, 2.35, 0), new THREE.Vector3(0, -2.35, 0),
    new THREE.Vector3(0, 0, 2.35), new THREE.Vector3(0, 0, -2.35)
  ];
  const bondCylGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.35, 16);
  const bondMat = new THREE.MeshStandardMaterial({
    color: 0xffb703,
    emissive: 0xff9900,
    emissiveIntensity: 0.4,
    metalness: 0.85,
    roughness: 0.2
  });
  const ligandGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const ligandMat = new THREE.MeshStandardMaterial({
    color: 0xffc400,
    emissive: 0xffb703,
    emissiveIntensity: 0.7,
    metalness: 0.9,
    roughness: 0.15
  });

  ligandVertices.forEach((v) => {
    const lig = new THREE.Mesh(ligandGeo, ligandMat);
    lig.position.copy(v);
    groupInorganic.add(lig);

    const bond = new THREE.Mesh(bondCylGeo, bondMat);
    const mid = v.clone().multiplyScalar(0.5);
    bond.position.copy(mid);
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
    groupInorganic.add(bond);
  });

  const egRingGeo = new THREE.TorusGeometry(2.75, 0.032, 16, 100);
  const orbitalRingMat = new THREE.MeshBasicMaterial({
    color: 0xffb703,
    transparent: true,
    opacity: 0.75
  });
  const egRing = new THREE.Mesh(egRingGeo, orbitalRingMat);
  egRing.rotation.x = Math.PI / 4;
  groupInorganic.add(egRing);

  const t2gRing = new THREE.Mesh(egRingGeo, orbitalRingMat);
  t2gRing.rotation.y = Math.PI / 4;
  t2gRing.rotation.z = Math.PI / 6;
  groupInorganic.add(t2gRing);

  /* ---------------------------------------------------------
     BRANCH 3: ORGANIC CHEMISTRY (Benzene Ring & Molecular Cluster)
     Accent: Emerald Green #10B981
     --------------------------------------------------------- */
  const groupOrganic = new THREE.Group();
  centerpiece.add(groupOrganic);

  const hexRadius = 1.75;
  const carbonNodes = [];
  const carbonPositions = [];
  const carbonGeo = new THREE.SphereGeometry(0.18, 16, 16);
  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 0.8,
    metalness: 0.7,
    roughness: 0.2
  });

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = Math.cos(angle) * hexRadius;
    const z = Math.sin(angle) * hexRadius;
    const cMesh = new THREE.Mesh(carbonGeo, carbonMat);
    cMesh.position.set(x, 0, z);
    groupOrganic.add(cMesh);
    carbonNodes.push(cMesh);
    carbonPositions.push(new THREE.Vector3(x, 0, z));
  }

  const ringBondMat = new THREE.MeshStandardMaterial({
    color: 0x059669,
    emissive: 0x10b981,
    emissiveIntensity: 0.35,
    roughness: 0.3,
    metalness: 0.6
  });

  for (let i = 0; i < 6; i++) {
    const p1 = carbonPositions[i];
    const p2 = carbonPositions[(i + 1) % 6];
    const dist = p1.distanceTo(p2);
    const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, dist, 16), ringBondMat);
    const mid = p1.clone().add(p2).multiplyScalar(0.5);
    bond.position.copy(mid);
    const dir = p2.clone().sub(p1).normalize();
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    groupOrganic.add(bond);
  }

  const piTorusGeo = new THREE.TorusGeometry(hexRadius * 0.92, 0.075, 16, 64);
  const piMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: 0x10b981,
    emissiveIntensity: 0.45,
    transparent: true,
    opacity: 0.42,
    roughness: 0.2
  });
  const piRingTop = new THREE.Mesh(piTorusGeo, piMat);
  piRingTop.position.y = 0.42;
  piRingTop.rotation.x = Math.PI / 2;
  groupOrganic.add(piRingTop);

  const piRingBottom = new THREE.Mesh(piTorusGeo, piMat);
  piRingBottom.position.y = -0.42;
  piRingBottom.rotation.x = Math.PI / 2;
  groupOrganic.add(piRingBottom);

  const tetraOrigin = carbonPositions[0].clone().add(new THREE.Vector3(0.95, 0.65, 0));
  const tetraNodeGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const tetraCenter = new THREE.Mesh(tetraNodeGeo, carbonMat);
  tetraCenter.position.copy(tetraOrigin);
  groupOrganic.add(tetraCenter);

  const linkDist = carbonPositions[0].distanceTo(tetraOrigin);
  const linkBond = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, linkDist, 16), ringBondMat);
  linkBond.position.copy(carbonPositions[0].clone().add(tetraOrigin).multiplyScalar(0.5));
  linkBond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tetraOrigin.clone().sub(carbonPositions[0]).normalize());
  groupOrganic.add(linkBond);

  const functionalColors = [0xef4444, 0x3b82f6, 0xffffff];
  const tetraVectors = [
    new THREE.Vector3(0.85, 0.55, 0.6),
    new THREE.Vector3(0.85, 0.55, -0.6),
    new THREE.Vector3(0.1, -0.9, 0.0)
  ];
  tetraVectors.forEach((tv, idx) => {
    const targetPos = tetraOrigin.clone().add(tv);
    const fNodeMat = new THREE.MeshStandardMaterial({
      color: functionalColors[idx],
      emissive: functionalColors[idx],
      emissiveIntensity: 0.75,
      roughness: 0.2
    });
    const fNode = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), fNodeMat);
    fNode.position.copy(targetPos);
    groupOrganic.add(fNode);
    carbonNodes.push(fNode);

    const fDist = tv.length();
    const fBond = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, fDist, 16), ringBondMat);
    fBond.position.copy(tetraOrigin.clone().add(targetPos).multiplyScalar(0.5));
    fBond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tv.clone().normalize());
    groupOrganic.add(fBond);
  });

  /* ---------------------------------------------------------
     HOLOGRAPHIC CORE ICON SPRITE
     --------------------------------------------------------- */
  function createHologramTexture(iconType) {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);

    ctx.save();
    ctx.translate(128, 128);

    if (iconType === 'physical') {
      ctx.strokeStyle = '#00F0FF';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 24;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      ctx.font = 'bold 54px JetBrains Mono, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Ψ', 0, -6);

      ctx.font = 'bold 18px JetBrains Mono, monospace';
      ctx.fillStyle = '#00F0FF';
      ctx.fillText('ΔG°', 0, 48);
    } else if (iconType === 'inorganic') {
      ctx.strokeStyle = '#FFB703';
      ctx.fillStyle = 'rgba(255, 183, 3, 0.15)';
      ctx.shadowColor = '#FFB703';
      ctx.shadowBlur = 24;
      ctx.lineWidth = 4;
      ctx.beginPath();
      const pts = [[0, -85], [75, -28], [75, 52], [0, 85], [-75, 52], [-75, -28]];
      pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      ctx.font = 'bold 40px JetBrains Mono, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('[M]ⁿ⁺', 0, -6);

      ctx.font = 'bold 18px JetBrains Mono, monospace';
      ctx.fillStyle = '#FFB703';
      ctx.fillText('d-CFT', 0, 48);
    } else {
      ctx.strokeStyle = '#10B981';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 24;
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const x = Math.cos(a) * 80;
        const y = Math.sin(a) * 80;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      ctx.font = 'bold 36px JetBrains Mono, monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('C₆H₆', 0, -6);

      ctx.font = 'bold 18px JetBrains Mono, monospace';
      ctx.fillStyle = '#10B981';
      ctx.fillText('sp³-C', 0, 48);
    }
    ctx.restore();

    const tex = new THREE.CanvasTexture(cv);
    tex.needsUpdate = true;
    return tex;
  }

  const holoTextures = {
    physical: createHologramTexture('physical'),
    inorganic: createHologramTexture('inorganic'),
    organic: createHologramTexture('organic')
  };

  const holoSpriteMat = new THREE.SpriteMaterial({
    map: holoTextures.physical,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending
  });
  const holoSprite = new THREE.Sprite(holoSpriteMat);
  holoSprite.scale.set(1.65, 1.65, 1);
  centerpiece.add(holoSprite);

  groupPhysical.scale.set(1, 1, 1);
  groupInorganic.scale.set(0, 0, 0);
  groupOrganic.scale.set(0, 0, 0);

  // Free Drag Interaction
  let isDragging = false;
  let dragStartX = 0, dragStartY = 0;
  let manualRotOffsetX = 0, manualRotOffsetY = 0;

  cubeCanvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  });
  window.addEventListener('mouseup', () => (isDragging = false));
  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      manualRotOffsetY += dx * 0.008;
      manualRotOffsetX += dy * 0.008;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    }
  });

  /* ---------------------------------------------------------
     SCROLL-LINKED MORPHING LOGIC
     --------------------------------------------------------- */
  const scrollyContainer = document.getElementById('scrollyShowcase');
  const stageGlow = document.getElementById('stageGlow');
  const progressFill = document.getElementById('progressFillLine');
  const stepDots = document.querySelectorAll('.scrolly-step-dot');
  const leftBlocks = document.querySelectorAll('.feature-text-block');
  const rightBlocks = document.querySelectorAll('.chapters-card-block');

  const scrollySteps = [
    { step: 0, branch: 'physical', colorHex: 0x00f0ff, colorCss: '#00F0FF', glowCss: 'rgba(0, 240, 255, 0.25)', rotX: 0.38, rotY: 0.50 },
    { step: 1, branch: 'inorganic', colorHex: 0xffb703, colorCss: '#FFB703', glowCss: 'rgba(255, 183, 3, 0.25)', rotX: 0.45, rotY: 1.65 },
    { step: 2, branch: 'organic', colorHex: 0x10b981, colorCss: '#10B981', glowCss: 'rgba(16, 185, 129, 0.25)', rotX: 0.65, rotY: 2.75 },
    { step: 3, branch: 'physical', colorHex: 0x00f0ff, colorCss: '#00F0FF', glowCss: 'rgba(0, 240, 255, 0.25)', rotX: 0.38, rotY: 3.85 },
    { step: 4, branch: 'inorganic', colorHex: 0xffb703, colorCss: '#FFB703', glowCss: 'rgba(255, 183, 3, 0.25)', rotX: 0.45, rotY: 4.95 },
    { step: 5, branch: 'organic', colorHex: 0x10b981, colorCss: '#10B981', glowCss: 'rgba(16, 185, 129, 0.25)', rotX: 0.65, rotY: 6.05 }
  ];

  let currentStep = 0;
  let currentBranch = 'physical';
  let targetCubeRotX = scrollySteps[0].rotX;
  let targetCubeRotY = scrollySteps[0].rotY;

  let physTargetScale = 1.0;
  let inorgTargetScale = 0.0;
  let orgTargetScale = 0.0;

  let glitchIntensity = 0.0;
  let glitchJitterX = 0;
  let glitchJitterY = 0;

  function updateRendererSize() {
    if (!cubeCanvas || !renderer) return;
    const rect = cubeCanvas.getBoundingClientRect();
    const width = Math.round(rect.width) || 520;
    const height = Math.round(rect.height) || 520;
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasInternalW = Math.round(width * pr);
    const canvasInternalH = Math.round(height * pr);
    if (cubeCanvas.width !== canvasInternalW || cubeCanvas.height !== canvasInternalH) {
      renderer.setPixelRatio(pr);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  function updateScrollytelling() {
    if (!scrollyContainer) return;
    updateRendererSize();
    const rect = scrollyContainer.getBoundingClientRect();
    const scrollDist = scrollyContainer.offsetHeight - window.innerHeight;
    if (scrollDist <= 0) return;
    let rawProgress = -rect.top / scrollDist;
    let progress = Math.max(0, Math.min(1, rawProgress));

    if (progressFill) {
      progressFill.style.height = `${progress * 100}%`;
    }

    let stepIndex = Math.min(5, Math.floor(progress * 6));
    if (progress >= 0.98) stepIndex = 5;

    if (stepIndex !== currentStep) {
      const prevBranch = scrollySteps[currentStep].branch;
      currentStep = stepIndex;
      onStepChange(stepIndex, prevBranch);
    }

    const stepConfig = scrollySteps[stepIndex];
    targetCubeRotX = stepConfig.rotX + Math.sin(progress * Math.PI * 6) * 0.08;
    targetCubeRotY = stepConfig.rotY + (progress * 6 - stepIndex) * 0.45;
  }

  function onStepChange(stepIdx, prevBranch) {
    const conf = scrollySteps[stepIdx];
    const newBranch = conf.branch;

    leftBlocks.forEach((b, i) => b.classList.toggle('active', i === stepIdx));
    rightBlocks.forEach((b, i) => b.classList.toggle('active', i === stepIdx));

    stepDots.forEach((d, i) => {
      const isActive = i === stepIdx;
      d.classList.toggle('active', isActive);
      if (isActive) {
        d.style.setProperty('--active-step-color', conf.colorCss);
        d.style.setProperty('--active-step-glow', conf.glowCss);
      }
    });

    if (stageGlow) stageGlow.style.setProperty('--stage-ambient', conf.glowCss);
    cubeCanvas.style.setProperty('--cube-glow', conf.glowCss);

    pointAccent.color.setHex(conf.colorHex);
    particleMat.color.setHex(conf.colorHex);

    if (newBranch !== prevBranch) {
      glitchIntensity = 1.0;
      currentBranch = newBranch;

      physTargetScale = newBranch === 'physical' ? 1.0 : 0.0;
      inorgTargetScale = newBranch === 'inorganic' ? 1.0 : 0.0;
      orgTargetScale = newBranch === 'organic' ? 1.0 : 0.0;

      holoSpriteMat.map = holoTextures[newBranch];
      holoSpriteMat.needsUpdate = true;
    } else {
      glitchIntensity = 0.55;
    }
  }

  stepDots.forEach((dot) => {
    dot.addEventListener('click', function () {
      const step = parseInt(this.getAttribute('data-step'));
      const rect = scrollyContainer.getBoundingClientRect();
      const scrollDist = scrollyContainer.offsetHeight - window.innerHeight;
      const targetScrollTop = window.scrollY + rect.top + ((step + 0.5) / 6) * scrollDist;
      window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', updateScrollytelling, { passive: true });
  window.addEventListener('resize', () => {
    updateRendererSize();
    updateScrollytelling();
  });

  // Initial trigger to configure step 0 and render sizing immediately
  updateRendererSize();
  updateScrollytelling();

  let clockTime = 0;
  function animateThree() {
    requestAnimationFrame(animateThree);
    clockTime += 0.016;

    centerpiece.rotation.x += (targetCubeRotX + manualRotOffsetX - centerpiece.rotation.x) * 0.08;
    centerpiece.rotation.y += (targetCubeRotY + manualRotOffsetY - centerpiece.rotation.y) * 0.08;

    centerpiece.position.y = Math.sin(clockTime * 1.8) * 0.14;
    centerpiece.rotation.z = Math.sin(clockTime * 1.2) * 0.04;

    groupPhysical.scale.x += (physTargetScale - groupPhysical.scale.x) * 0.12;
    groupPhysical.scale.y += (physTargetScale - groupPhysical.scale.y) * 0.12;
    groupPhysical.scale.z += (physTargetScale - groupPhysical.scale.z) * 0.12;

    groupInorganic.scale.x += (inorgTargetScale - groupInorganic.scale.x) * 0.12;
    groupInorganic.scale.y += (inorgTargetScale - groupInorganic.scale.y) * 0.12;
    groupInorganic.scale.z += (inorgTargetScale - groupInorganic.scale.z) * 0.12;

    groupOrganic.scale.x += (orgTargetScale - groupOrganic.scale.x) * 0.12;
    groupOrganic.scale.y += (orgTargetScale - groupOrganic.scale.y) * 0.12;
    groupOrganic.scale.z += (orgTargetScale - groupOrganic.scale.z) * 0.12;

    if (glitchIntensity > 0.01) {
      glitchJitterX = (Math.random() - 0.5) * 0.28 * glitchIntensity;
      glitchJitterY = (Math.random() - 0.5) * 0.28 * glitchIntensity;
      centerpiece.position.x = glitchJitterX;
      centerpiece.position.z = glitchJitterY;
      holoSprite.scale.set(
        1.65 + (Math.random() - 0.5) * 0.4 * glitchIntensity,
        1.65 + (Math.random() - 0.5) * 0.4 * glitchIntensity,
        1
      );
      glitchIntensity *= 0.88;
    } else {
      centerpiece.position.x = 0;
      centerpiece.position.z = 0;
      holoSprite.scale.set(1.65 + Math.sin(clockTime * 2.5) * 0.08, 1.65 + Math.sin(clockTime * 2.5) * 0.08, 1);
    }

    innerEdgesMesh.rotation.y += 0.012;
    innerEdgesMesh.rotation.x -= 0.008;
    waveRings.forEach((r, idx) => {
      const pulse = 1.0 + Math.sin(clockTime * 3.5 + idx * 1.2) * 0.08;
      r.scale.set(pulse, pulse, pulse);
    });

    egRing.rotation.z += 0.015;
    t2gRing.rotation.x += 0.012;

    piRingTop.rotation.z += 0.008;
    piRingBottom.rotation.z -= 0.008;
    carbonNodes.forEach((cn, idx) => {
      const nodePulse = 1.0 + Math.sin(clockTime * 4.0 + idx * 0.8) * 0.12;
      cn.scale.set(nodePulse, nodePulse, nodePulse);
    });

    particlesMesh.rotation.y = clockTime * 0.04;
    particlesMesh.rotation.x = clockTime * 0.025;

    renderer.render(scene, camera);
  }
  animateThree();
}

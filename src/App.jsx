import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useState, useEffect } from "react";
import * as component from "./component";

function App() {
  const [portfolios, setPortfolios] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await component.readPortfolios();
      setPortfolios(result.data.data);
      console.log(result.data);
    };
    fetchData();
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#bg"),
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    renderer.render(scene, camera);

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    const torus = new THREE.Mesh(geometry, material);

    scene.add(torus);
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    const lightHelper = new THREE.PointLightHelper(pointLight);
    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(lightHelper, gridHelper);

    const controls = new OrbitControls(camera, renderer.domElement);

    function addStar() {
      const geometry = new THREE.SphereGeometry(0.25);
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(geometry, material);

      const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(100));

      star.position.set(x, y, z);
      scene.add(star);
    }

    Array(250).fill().forEach(addStar);

    const spaceTexture = new THREE.TextureLoader().load("/../images/black.jpg");
    scene.background = spaceTexture;

    const avatarTexture = new THREE.TextureLoader().load(
      "/../images/avatar.jpg"
    );

    const avatar = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 3),
      new THREE.MeshBasicMaterial({ map: avatarTexture })
    );

    scene.add(avatar);

    const planetTexture = new THREE.TextureLoader().load(
      "/../mercury/scene.gltf"
    );

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshStandardMaterial({ map: planetTexture })
    );

    scene.add(planet);

    planet.position.z = 30;
    planet.position.setX(-10);

    function moveCamera() {
      const t = document.body.getBoundingClientRect().top;
      planet.rotation.x += 0.05;
      planet.rotation.y += 0.075;
      planet.rotation.z += 0.05;

      avatar.rotation.y += 0.01;
      avatar.rotation.z += 0.01;

      camera.position.z = t * -0.01;
      camera.position.x = t * -0.0002;
      camera.rotation.y = t * -0.0002;
    }

    document.body.onscroll = moveCamera;

    function animate() {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      torus.rotation.y += 0.01;

      controls.update();

      renderer.render(scene, camera);
    }

    animate();
  }, []);
  return (
    <div className="App">
      {portfolios.length > 0 ? (
        portfolios.map((portfolio, i) => (
          <div className="title" key={i}>
            <div className="portfolio">
              <h1 className="title"> {portfolio.attributes.myname}</h1>
              <p className="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            <div className="projects">
              <h1>Projects</h1>
              <div className="projects-table">
                <div className="projects-card">
                  <p className="title">Porject1</p>
                  <p className="info">
                    {portfolio.attributes.projectdescription}
                  </p>
                  <button className="btn">check it out here</button>
                </div>

                <div className="projects-card">
                  <p className="title">project2</p>
                  <p className="info">
                    {portfolio.attributes.projectdescription}
                  </p>
                  <button className="btn">check it out here</button>
                </div>
                <div className="projects-card">
                  <p className="title">project3</p>
                  <p className="info">
                    {portfolio.attributes.projectdescription}
                  </p>
                  <button className="btn">check it out here</button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h2></h2>
      )}
      <canvas id="bg"></canvas>
    </div>
  );
}

export default App;

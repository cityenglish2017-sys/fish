/* ========================================== */
/* 물고기 종류 */
/* ========================================== */

const species = [

  {
    id: "blue",
    icon: "🐟",
    stars: 1,
    basePrice: 8,
    weight: 36,
    size: "small",
    className: "common"
  },

  {
    id: "orange",
    icon: "🐠",
    stars: 2,
    basePrice: 16,
    weight: 25,
    size: "",
    className: "common"
  },

  {
    id: "puffer",
    icon: "🐡",
    stars: 3,
    basePrice: 32,
    weight: 16,
    size: "",
    className: "rare"
  },

  {
    id: "big",
    icon: "🐟",
    stars: 3,
    basePrice: 45,
    weight: 12,
    size: "large",
    className: "rare"
  },

  {
    id: "gold",
    icon: "🐠",
    stars: 4,
    basePrice: 90,
    weight: 7,
    size: "large",
    className: "legendary"
  },

  {
    id: "rainbow",
    icon: "🐡",
    stars: 5,
    basePrice: 180,
    weight: 4,
    size: "large",
    className: "legendary"
  }

];


/* ========================================== */
/* DOM */
/* ========================================== */

const river =
  document.getElementById("river");

const fishLayer =
  document.getElementById("fishLayer");

const netSelection =
  document.getElementById("netSelection");

const warehouseGrid =
  document.getElementById("warehouseGrid");

const fishCountEl =
  document.getElementById("fishCount");

const coinCountEl =
  document.getElementById("coinCount");

const lastCatchEl =
  document.getElementById("lastCatch");

const catchEffect =
  document.getElementById("catchEffect");


/* 경매 */

const auctionModal =
  document.getElementById("auctionModal");

const auctionOpenBtn =
  document.getElementById("auctionOpenBtn");

const auctionCloseBtn =
  document.getElementById("auctionCloseBtn");

const auctionFish =
  document.getElementById("auctionFish");

const auctionStars =
  document.getElementById("auctionStars");

const auctionBasePrice =
  document.getElementById("auctionBasePrice");

const auctionResult =
  document.getElementById("auctionResult");

const sellBtn =
  document.getElementById("sellBtn");

const bid1 =
  document.getElementById("bid1");

const bid2 =
  document.getElementById("bid2");

const bid3 =
  document.getElementById("bid3");


/* 희귀 팝업 */

const rarePopup =
  document.getElementById("rarePopup");

const rarePopupFish =
  document.getElementById("rarePopupFish");

const rarePopupStars =
  document.getElementById("rarePopupStars");


/* ========================================== */
/* 게임 상태 */
/* ========================================== */

let fishes = [];

let nextFishId = 1;

let coins = 0;

let inventory = {};

let drawingNet = false;

let startX = 0;
let startY = 0;

let currentRect = null;

let selectedAuctionSpecies = null;

let auctionRunning = false;


/* ========================================== */
/* 인벤토리 초기화 */
/* ========================================== */

species.forEach(
  fish => {

    inventory[fish.id] = 0;

  }
);


/* ========================================== */
/* 랜덤 종 선택 */
/* ========================================== */

function randomSpecies() {

  const total =
    species.reduce(
      (sum, fish) =>
        sum + fish.weight,
      0
    );


  let random =
    Math.random() *
    total;


  for (
    const fish of species
  ) {

    random -=
      fish.weight;


    if (
      random <= 0
    ) {

      return fish;

    }

  }


  return species[0];

}


/* ========================================== */
/* 물고기 생성 */
/* ========================================== */

function createFish(
  initial = false
) {

  const type =
    randomSpecies();


  const element =
    document.createElement(
      "div"
    );


  element.className =
    `fish ${type.size} ${type.className}`;


  element.textContent =
    type.icon;


  fishLayer.appendChild(
    element
  );


  const layerRect =
    fishLayer.getBoundingClientRect();


  const direction =
    Math.random() >
    0.5
      ? 1
      : -1;


  let x;


  if (initial) {

    x =
      Math.random() *
      layerRect.width;

  }

  else {

    x =
      direction === 1
        ? -60
        : layerRect.width + 60;

  }


  const y =
    5 +
    Math.random() *
    Math.max(
      40,
      layerRect.height - 60
    );


  const speed =
    20 +
    Math.random() *
    35;


  const fish = {

    id:
      nextFishId++,

    type,

    element,

    x,

    y,

    speed,

    direction

  };


  if (
    direction === -1
  ) {

    element.style.transform =
      "scaleX(-1)";

  }


  fishes.push(
    fish
  );


  renderFish(
    fish
  );

}


/* ========================================== */
/* 물고기 표시 */
/* ========================================== */

function renderFish(
  fish
) {

  fish.element.style.left =
    `${fish.x}px`;


  fish.element.style.top =
    `${fish.y}px`;

}


/* ========================================== */
/* 물고기 제거 */
/* ========================================== */

function removeFish(
  fish
) {

  fish.element.remove();


  fishes =
    fishes.filter(
      f =>
        f.id !== fish.id
    );

}


/* ========================================== */
/* 새 물고기 보충 */
/* ========================================== */

function maintainFishCount() {

  while (
    fishes.length < 23
  ) {

    createFish();

  }

}


/* ========================================== */
/* 애니메이션 */
/* ========================================== */

let lastTime =
  performance.now();


function gameLoop(
  now
) {

  const dt =
    Math.min(
      0.05,
      (now - lastTime) /
      1000
    );


  lastTime =
    now;


  const rect =
    fishLayer.getBoundingClientRect();


  fishes.forEach(
    fish => {

      fish.x +=
        fish.speed *
        fish.direction *
        dt;


      if (
        fish.direction === 1 &&
        fish.x >
        rect.width + 80
      ) {

        fish.x =
          -70;


        fish.y =
          Math.random() *
          Math.max(
            50,
            rect.height - 50
          );

      }


      if (
        fish.direction === -1 &&
        fish.x <
        -80
      ) {

        fish.x =
          rect.width + 70;


        fish.y =
          Math.random() *
          Math.max(
            50,
            rect.height - 50
          );

      }


      renderFish(
        fish
      );

    }
  );


  requestAnimationFrame(
    gameLoop
  );

}


/* ========================================== */
/* 그물 좌표 */
/* ========================================== */

function getPointerPosition(
  event
) {

  const rect =
    river.getBoundingClientRect();


  return {

    x:
      event.clientX -
      rect.left,

    y:
      event.clientY -
      rect.top

  };

}


/* ========================================== */
/* 그물 시작 */
/* ========================================== */

river.addEventListener(
  "pointerdown",
  event => {

    const point =
      getPointerPosition(
        event
      );


    /*
      강둑 부분에서는
      그물을 시작하지 않음
    */

    if (
      point.y < 45 ||
      point.y >
      river.clientHeight - 45
    ) {

      return;

    }


    drawingNet =
      true;


    startX =
      point.x;


    startY =
      point.y;


    netSelection.classList.remove(
      "hidden"
    );


    netSelection.style.left =
      `${startX}px`;


    netSelection.style.top =
      `${startY}px`;


    netSelection.style.width =
      "1px";


    netSelection.style.height =
      "1px";


    river.setPointerCapture(
      event.pointerId
    );

  }
);


/* ========================================== */
/* 그물 드래그 */
/* ========================================== */

river.addEventListener(
  "pointermove",
  event => {

    if (
      !drawingNet
    ) {

      return;

    }


    const point =
      getPointerPosition(
        event
      );


    const left =
      Math.min(
        startX,
        point.x
      );


    const top =
      Math.min(
        startY,
        point.y
      );


    const width =
      Math.abs(
        point.x -
        startX
      );


    const height =
      Math.abs(
        point.y -
        startY
      );


    currentRect = {

      left,
      top,
      width,
      height

    };


    netSelection.style.left =
      `${left}px`;


    netSelection.style.top =
      `${top}px`;


    netSelection.style.width =
      `${width}px`;


    netSelection.style.height =
      `${height}px`;

  }
);


/* ========================================== */
/* 그물 종료 */
/* ========================================== */

river.addEventListener(
  "pointerup",
  event => {

    if (
      !drawingNet
    ) {

      return;

    }


    drawingNet =
      false;


    try {

      river.releasePointerCapture(
        event.pointerId
      );

    }

    catch (error) {

      /* 무시 */

    }


    if (
      !currentRect ||
      currentRect.width <
      35 ||
      currentRect.height <
      35
    ) {

      netSelection.classList.add(
        "hidden"
      );


      currentRect =
        null;


      return;

    }


    catchFishWithNet(
      currentRect
    );


    setTimeout(
      () => {

        netSelection.classList.add(
          "hidden"
        );

      },
      280
    );


    currentRect =
      null;

  }
);


/* ========================================== */
/* 그물로 물고기 잡기 */
/* ========================================== */

function catchFishWithNet(
  rect
) {

  const riverRect =
    river.getBoundingClientRect();


  const layerRect =
    fishLayer.getBoundingClientRect();


  const offsetX =
    layerRect.left -
    riverRect.left;


  const offsetY =
    layerRect.top -
    riverRect.top;


  const caught =
    [];


  fishes.forEach(
    fish => {

      const fishCenterX =
        offsetX +
        fish.x +
        27;


      const fishCenterY =
        offsetY +
        fish.y +
        20;


      const inside =
        fishCenterX >=
        rect.left &&

        fishCenterX <=
        rect.left +
        rect.width &&

        fishCenterY >=
        rect.top &&

        fishCenterY <=
        rect.top +
        rect.height;


      if (
        inside
      ) {

        caught.push(
          fish
        );

      }

    }
  );


  caught.forEach(
    fish => {

      inventory[
        fish.type.id
      ] += 1;


      if (
        fish.type.stars >=
        4
      ) {

        showRarePopup(
          fish.type
        );

      }


      removeFish(
        fish
      );

    }
  );


  lastCatchEl.textContent =
    `× ${caught.length}`;


  if (
    caught.length > 0
  ) {

    showCatchEffect(
      caught.length
    );

  }


  updateWarehouse();


  /*
    잠깐 뒤 다시 강에
    새 물고기 생성
  */

  setTimeout(
    maintainFishCount,
    450
  );

}


/* ========================================== */
/* 잡기 효과 */
/* ========================================== */

function showCatchEffect(
  count
) {

  catchEffect.textContent =
    count >= 5
      ? `🎉 ×${count}`
      : `🐟 ×${count}`;


  catchEffect.classList.remove(
    "hidden"
  );


  setTimeout(
    () => {

      catchEffect.classList.add(
        "hidden"
      );

  },
  650
  );

}


/* ========================================== */
/* 희귀 획득 */
/* ========================================== */

function showRarePopup(
  type
) {

  rarePopupFish.textContent =
    type.icon;


  rarePopupStars.textContent =
    "⭐".repeat(
      type.stars
    );


  rarePopup.classList.remove(
    "hidden"
  );


  setTimeout(
    () => {

      rarePopup.classList.add(
        "hidden"
      );

    },
    900
  );

}


/* ========================================== */
/* 총 물고기 수 */
/* ========================================== */

function totalFishCount() {

  return Object
    .values(
      inventory
    )
    .reduce(
      (sum,count) =>
        sum + count,
      0
    );

}


/* ========================================== */
/* 창고 갱신 */
/* ========================================== */

function updateWarehouse() {

  warehouseGrid.innerHTML =
    "";


  species.forEach(
    type => {

      const count =
        inventory[
          type.id
        ];


      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "fish-storage";


      if (
        count === 0
      ) {

        button.classList.add(
          "empty"
        );

      }


      const stars =
        "⭐".repeat(
          type.stars
        );


      let miniStack =
        "";


      const miniCount =
        Math.min(
          count,
          6
        );


      for (
        let i = 0;
        i < miniCount;
        i++
      ) {

        miniStack +=
          `<span class="storage-mini">${type.icon}</span>`;

      }


      button.innerHTML =
        `
          <div class="storage-icon">
            ${type.icon}
          </div>

          <div class="storage-stars">
            ${stars}
          </div>

          <div class="storage-stack">
            ${miniStack}
          </div>

          <div class="storage-count">
            ×${count}
          </div>
        `;


      button.addEventListener(
        "click",
        () => {

          if (
            count > 0
          ) {

            openAuction(
              type
            );

          }

        }
      );


      warehouseGrid.appendChild(
        button
      );

    }
  );


  fishCountEl.textContent =
    totalFishCount();


  coinCountEl.textContent =
    coins;

}


/* ========================================== */
/* 경매 열기 */
/* ========================================== */

function openAuction(
  type
) {

  if (
    inventory[
      type.id
    ] <= 0
  ) {

    return;

  }


  selectedAuctionSpecies =
    type;


  auctionRunning =
    false;


  auctionFish.textContent =
    type.icon;


  auctionStars.textContent =
    "⭐".repeat(
      type.stars
    );


  auctionBasePrice.textContent =
    type.basePrice;


  bid1.textContent =
    "0";


  bid2.textContent =
    "0";


  bid3.textContent =
    "0";


  auctionResult.textContent =
    "🔨 👀";


  clearBidderHighlights();


  sellBtn.disabled =
    false;


  sellBtn.textContent =
    "🔨 GO!";


  auctionModal.classList.remove(
    "hidden"
  );

}


/* ========================================== */
/* 창고 전체에서 경매 열기 */
/* ========================================== */

auctionOpenBtn.addEventListener(
  "click",
  () => {

    const available =
      species.filter(
        type =>
          inventory[
            type.id
          ] > 0
      );


    if (
      available.length === 0
    ) {

      lastCatchEl.textContent =
        "🧺 0";


      return;

    }


    /*
      가장 희귀한 물고기를
      우선 선택
    */

    available.sort(
      (a,b) =>
        b.stars -
        a.stars
    );


    openAuction(
      available[0]
    );

  }
);


/* ========================================== */
/* 경매 */
/* ========================================== */

sellBtn.addEventListener(
  "click",
  () => {

    if (
      !selectedAuctionSpecies ||
      auctionRunning
    ) {

      return;

    }


    if (
      inventory[
        selectedAuctionSpecies.id
      ] <= 0
    ) {

      return;

    }


    auctionRunning =
      true;


    sellBtn.disabled =
      true;


    sellBtn.textContent =
      "🔨 🔥";


    runAuction();

  }
);


/* ========================================== */
/* 경매 실행 */
/* ========================================== */

function runAuction() {

  const type =
    selectedAuctionSpecies;


  const rarityBonus =
    1 +
    type.stars *
    0.16;


  let round =
    0;


  let bids =
    [
      0,
      0,
      0
    ];


  const timer =
    setInterval(
      () => {

        round += 1;


        bids =
          bids.map(
            (oldBid,index) => {

              const personality =
                [
                  .92,
                  1.05,
                  1.15
                ][index];


              const random =
                .75 +
                Math.random() *
                .8;


              const target =
                type.basePrice *
                rarityBonus *
                personality *
                random;


              return Math.max(
                oldBid,
                Math.round(
                  target
                )
              );

            }
          );


        bid1.textContent =
          bids[0];


        bid2.textContent =
          bids[1];


        bid3.textContent =
          bids[2];


        highlightHighestBid(
          bids
        );


        if (
          round >= 7
        ) {

          clearInterval(
            timer
          );


          finishAuction(
            bids
          );

        }

      },
      330
    );

}


/* ========================================== */
/* 최고가 표시 */
/* ========================================== */

function highlightHighestBid(
  bids
) {

  clearBidderHighlights();


  const highest =
    Math.max(
      ...bids
    );


  const index =
    bids.indexOf(
      highest
    );


  const bidderEls =
    document.querySelectorAll(
      ".bidder"
    );


  bidderEls[
    index
  ].classList.add(
    "leading"
  );

}


/* ========================================== */
/* 경매 강조 초기화 */
/* ========================================== */

function clearBidderHighlights() {

  document
    .querySelectorAll(
      ".bidder"
    )
    .forEach(
      element => {

        element.classList.remove(
          "leading"
        );

      }
    );

}


/* ========================================== */
/* 경매 종료 */
/* ========================================== */

function finishAuction(
  bids
) {

  const highest =
    Math.max(
      ...bids
    );


  const winnerIndex =
    bids.indexOf(
      highest
    );


  const winnerEmoji =
    [
      "👩",
      "👨",
      "👵"
    ][winnerIndex];


  coins +=
    highest;


  inventory[
    selectedAuctionSpecies.id
  ] -= 1;


  auctionResult.textContent =
    `${winnerEmoji} 🏆  🪙 ${highest}`;


  sellBtn.textContent =
    "✅";


  updateWarehouse();


  setTimeout(
    () => {

      auctionModal.classList.add(
        "hidden"
      );


      auctionRunning =
        false;


      selectedAuctionSpecies =
        null;


    },
    1200
  );

}


/* ========================================== */
/* 경매 닫기 */
/* ========================================== */

auctionCloseBtn.addEventListener(
  "click",
  () => {

    if (
      auctionRunning
    ) {

      return;

    }


    auctionModal.classList.add(
      "hidden"
    );


    selectedAuctionSpecies =
      null;

  }
);


/* ========================================== */
/* 초기 물고기 */
/* ========================================== */

function initFish() {

  for (
    let i = 0;
    i < 23;
    i++
  ) {

    createFish(
      true
    );

  }

}


/* ========================================== */
/* 화면 크기 변경 */
/* ========================================== */

window.addEventListener(
  "resize",
  () => {

    const rect =
      fishLayer.getBoundingClientRect();


    fishes.forEach(
      fish => {

        fish.y =
          Math.min(
            fish.y,
            Math.max(
              20,
              rect.height - 50
            )
          );

      }
    );

  }
);


/* ========================================== */
/* 시작 */
/* ========================================== */

updateWarehouse();

initFish();

requestAnimationFrame(
  gameLoop
);
/* eslint-disable no-unused-vars */
/*** online/offline tester */

// request small image at an interval to determine status
/*const checkOnlineStatus = async () => {
  try {
    const online = await fetch("/1pixel.png");
    return online.status >= 200 && online.status < 300;
  } catch (error) {
    return false; // definitely offline
  }
};

setInterval(async () => {
  const result = await checkOnlineStatus();
  let state = result ? "online" : "offline";
  //console.log(state, "ok");
}, 3000);
*/
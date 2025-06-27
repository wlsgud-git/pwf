// 유저 스트림 가져오기
export let getStream = async (id?: string) => {
  try {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: id },
      audio: true,
    });
    return stream;
  } catch (err) {
    console.log(err);
  }
};

// 내 관련 미디어 가져오기
export let getMyMedia = async () => {
  try {
    let devices = await navigator.mediaDevices.enumerateDevices();
    return devices;
  } catch (err) {
    console.log(err);
  }
};

// 화면 공유 미디어 가져오기
export let getShareMedia = async () => {
  try {
    let devices = await navigator.mediaDevices.enumerateDevices();
    return devices;
  } catch (err) {
    console.log(err);
  }
};

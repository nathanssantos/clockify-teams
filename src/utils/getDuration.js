const getHours = (_time) => {
  try {
    const time = _time?.split("H");
    let hours = 0;
    let minutes = 0;

    if (time?.length) {
      if (time?.length === 2) {
        hours = Number(time[0].split("PT")[1]);
        minutes = Number(time[1].split("M")[0]);
      } else {
        minutes = Number(time[0].replace("PT", "").replace("M", ""));
      }

      return Number(hours + minutes / 60);
    }
  } catch (error) {
    console.log(error);
  }
};

export default getHours;

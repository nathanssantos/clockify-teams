const getHours = (_time) => {
  try {
    const time = _time?.split('H');
    let hours = 0;
    let minutes = 0;

    if (time?.length) {
      if (time?.length === 2) {
        hours = Number(time[0].split('PT')[1]) || 0;
        minutes = Number(time[1].split('M')[0]) || 0;
      } else if (time[0] !== 'PT0S') {
        minutes = Number(time[0].replace('PT', '').replace('M', ''));
      }

      return Number(hours + minutes / 60);
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getHours;

const getDate = (_dateTime) => {
  try {
    const dateTime = _dateTime?.split('T');

    if (dateTime?.length) {
      const date = dateTime[0].split('-');

      return `${date[2]}/${date[1]}/${date[0]}`;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getDate;

/* eslint-disable react/prop-types */
import React from 'react';
import NumberFormat from 'react-number-format';

const Currency = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalScale={2}
      decimalSeparator=","
      fixedDecimalScale
      isNumericString
    />
  );
});

export default { Currency };

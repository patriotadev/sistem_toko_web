import Chart from "../../base-components/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "../../utils/colors";
import { selectColorScheme } from "../../stores/common/colorSchemeSlice";
import { selectDarkMode } from "../../stores/common/darkModeSlice";
import { useAppSelector } from "../../stores/hooks";
import { useMemo } from "react";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
  width: number;
  height: number;
  dataValue: any[];
}

function Main(props: MainProps) {
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  const tempData: number[] = [];
  props?.dataValue?.map((dv) => tempData.push(dv.sum));
  const chartData = props?.dataValue?.map((dv) => dv.sum);
  const chartColors = () => [
    getColor("primary", 0.9),
    getColor("pending", 0.9),
    getColor("info", 0.9),
    getColor("warning", 0.9),
    getColor("secondary", 0.9),
  ];
  const data: ChartData = useMemo(() => {
    return {
      labels: props?.dataValue?.map((dv) => dv.stokName),
      datasets: [
        {
          data: chartData,
          backgroundColor: colorScheme ? chartColors() : "",
          hoverBackgroundColor: colorScheme ? chartColors() : "",
          borderWidth: 5,
          borderColor: darkMode ? getColor("darkmode.700") : getColor("white"),
        },
      ],
    };
  }, [colorScheme, darkMode]);

  const options: ChartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }, [colorScheme, darkMode]);

  return (
    <Chart
      type="pie"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
    />
  );
}

Main.defaultProps = {
  width: "auto",
  height: "auto",
  className: "",
};

export default Main;

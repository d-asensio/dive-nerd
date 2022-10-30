export default {
  charts: {
    background: '#141418',
    textColor: '#333333',
    fontSize: 11,
    axis: {
      domain: {
        line: {
          stroke: '#dddee0',
          strokeWidth: 1
        }
      },
      legend: {
        text: {
          fontSize: 12,
          fill: '#dddee0'
        }
      },
      ticks: {
        line: {
          stroke: '#dddee0',
          strokeWidth: 1
        },
        text: {
          fontSize: 11,
          fill: '#dddee0'
        }
      }
    },
    grid: {
      line: {
        stroke: '#dddddd',
        strokeWidth: 1
      }
    },
    legends: {
      title: {
        text: {
          fontSize: 11,
          fill: '#333333'
        }
      },
      text: {
        fontSize: 11,
        fill: '#333333'
      },
      ticks: {
        line: {},
        text: {
          fontSize: 10,
          fill: '#333333'
        }
      }
    },
    annotations: {
      text: {
        fontSize: 13,
        fill: '#333333',
        outlineWidth: 2,
        outlineColor: '#dddee0',
        outlineOpacity: 1
      },
      link: {
        stroke: '#000000',
        strokeWidth: 0,
        outlineWidth: 1,
        outlineColor: '#ffffff',
        outlineOpacity: 1
      },
      outline: {
        stroke: '#000000',
        strokeWidth: 2,
        outlineWidth: 2,
        outlineColor: '#ffffff',
        outlineOpacity: 1
      },
      symbol: {
        fill: '#000000',
        outlineWidth: 2,
        outlineColor: '#ffffff',
        outlineOpacity: 1
      }
    },
    tooltip: {
      container: {
        background: '#ffffff',
        color: '#333333',
        fontSize: 12
      },
      basic: {},
      chip: {},
      table: {},
      tableCell: {},
      tableCellValue: {}
    }
  }
}

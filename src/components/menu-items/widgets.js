// assets
import BarChartIcon from '@mui/icons-material/BarChart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import StorageIcon from '@mui/icons-material/Storage';

// icons
const icons = {
  BarChartIcon,
  QueryStatsIcon,
  StorageIcon
};

const widgets = [
  {
    id: '0',
    title: 'Chart',
    icon: icons.BarChartIcon,
    url: 'dummy/url',
  },
  {
    id: '1',
    title: 'Statistics',
    icon: icons.QueryStatsIcon,
    url: 'dummy/url',
  },
  {
    id: '2',
    title: 'Data',
    icon: icons.StorageIcon,
    url: 'dummy/url',
  }
]

export default widgets;

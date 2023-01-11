// assets
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HeadphonesIcon from '@mui/icons-material/Headphones';

// icons
const icons = {
  ViewKanbanIcon,
  ChatIcon,
  CalendarMonthIcon,
  HeadphonesIcon
};

const applications = [
  {
    id: '0',
    title: 'Kanban',
    icon: icons.ViewKanbanIcon,
    url: 'dummy/url',
  },
  {
    id: '1',
    title: 'Chat',
    icon: icons.ChatIcon,
    url: 'dummy/url',
  },
  {
    id: '2',
    title: 'Calendar',
    icon: icons.CalendarMonthIcon,
    url: 'dummy/url',
  },
  {
    id: '3',
    title: 'Customer',
    icon: icons.HeadphonesIcon,
    url: 'dummy/url',
  }
]

export default applications;

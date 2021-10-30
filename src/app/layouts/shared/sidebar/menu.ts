import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'Menu',
        isTitle: true,
        status: false
    },
    {
        id: 2,
        label: 'Dashboard',
        icon: 'ri-dashboard-line',
        link: '/',
        status: false
    },
    {
        id: 4,
        label: 'Gestión de Improvers',
        icon: 'fas fa-users',
        link: '/improvers',
        status: false
    },
    {
        id: 11,
        label: 'Gestión de Potenciales',
        icon: 'fas fa-user-check',
        link: '/potentials',
        status: false
    },
    {
        id: 5,
        label: 'Gestión de Speakers',
        icon: 'fab fa-teamspeak',
        link: '/speakers',
        status: false
    },
    {
        id: 6,
        label: 'Gestión de administradores',
        icon: 'fas fa-user-tie',
        link: '/administrators',
        status: false
    },
    {
        id: 7,
        label: 'Gestión de banners',
        icon: 'far fa-image',
        link: '/banners',
        status: false
    },
    {
        id: 8,
        label: 'Gestión de pagos',
        icon: 'far fa-money-bill-alt',
        link: '/pagos',
        status: false
    },
    {
        id: 9,
        label: 'Gestión de facturas',
        icon: 'fas fa-file-invoice',
        link: '/facturas',
        status: false
    },
    {
        id: 12,
        label: 'Notificaciones',
        icon: ' fas fa-bell',
        link: '/notifications',
        status: false
    },
    {
        id: 10,
        label: 'Solicitud de soporte',
        icon: ' fas fa-question',
        link: '/soporte',
        status: false
    }

];

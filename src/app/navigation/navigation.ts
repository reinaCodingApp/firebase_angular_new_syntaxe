import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'dashboards',
                title    : 'Site web',
                type     : 'collapsable',
                icon     : 'dashboard',
                children : [
                    {
                        id       : 'posts',
                        title    : 'Articles',
                        type     : 'item',
                        icon     : 'account_box',
                        url      : '/posts'
                    },
                    {
                        id       : 'categories',
                        title    : 'Catégories',
                        type     : 'item',
                        icon     : 'folder',
                        url      : '/categories'
                    }
                ]
            }
        ]
    }];

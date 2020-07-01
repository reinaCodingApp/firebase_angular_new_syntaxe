export const navigation: any[] = [
  {
    id: 'applications',
    title: 'APPLICATIONS',
    type: 'group',
    children: [
      {
        id: 'webcms',
        title: 'Site web',
        type: 'collapsable',
        icon: 'language',
        children: [
          {
            id: 'posts',
            title: 'Gestion de contenu',
            type: 'item',
            icon: 'art_track',
            url: '/website',
            displayInMenu: true
          },
          {
            id: 'webmessages',
            title: 'Messagerie Web',
            type: 'item',
            icon: 'email',
            url: '/webcms',
            displayInMenu: true
          },
          {
            id: 'marksProducts',
            title: 'Marques & Products',
            type: 'item',
            icon: 'dashboard',
            url: '/marks-products',
            displayInMenu: true
          }
        ],
        displayInMenu: true
      },
      {
        id: 'administrative',
        title: 'Administratif',
        type: 'collapsable',
        icon: 'dashboard',
        children: [
          {
            id: 'absences',
            title: 'Congés et absences',
            type: 'item',
            icon: 'assignment_late',
            url: '/absences',
            displayInMenu: true
          },
          {
            id: 'advancesalary',
            title: 'Acomptes',
            type: 'item',
            icon: 'euro_symbol',
            url: '/advanceSalary',
            displayInMenu: true
          },
          {
            id: 'missionorder',
            title: 'Ordres de missions',
            type: 'item',
            icon: 'work_outline',
            url: '/missionOrder',
            displayInMenu: true
          },
          {
            id: 'foreignmission',
            title: 'Missions à l\'étranger',
            type: 'item',
            icon: 'transfer_within_a_station',
            url: '/foreignMission',
            displayInMenu: true
          },
          {
            id: 'paymentStatistics',
            title: 'Paies',
            type: 'item',
            icon: 'description',
            url: '/paymentStatistics',
            exactMatch: true,
            displayInMenu: true
          },
          {
            id: 'audits',
            title: 'Audits',
            type: 'item',
            icon: 'spellcheck',
            url: '/audits',
            exactMatch: true,
            displayInMenu: true
          },
        ],
        displayInMenu: true
      },
      {
        id: 'tickets',
        title: 'Tickets',
        type: 'collapsable',
        icon: 'format_list_bulleted',
        children: [
          {
            id: 'ticket',
            title: 'Tickets Techniques',
            type: 'item',
            icon: 'message',
            url: '/ticket',
            displayInMenu: false
          }
        ],
        displayInMenu: false
      },
      {
        id: 'activity',
        title: 'Activité',
        type: 'collapsable',
        icon: 'developer_board',
        children: [
          {
            id: 'employeeactivity',
            title: 'Pointages salariés',
            type: 'item',
            icon: 'radio_button_checked',
            url: '/activity',
            exactMatch: true,
            displayInMenu: true
          },
          {
            id: 'interimactivity',
            title: 'Pointages intérimaires',
            type: 'item',
            icon: 'radio_button_unchecked',
            url: '/activity/interim',
            exactMatch: true,
            displayInMenu: true
          },
          {
            id: 'recapactivity',
            title: 'Récapitulatif activités',
            type: 'item',
            icon: 'list_alt',
            url: '/recapActivity',
            displayInMenu: true
          },
          {
            id: 'toursheet',
            title: 'Feuilles de tournées',
            type: 'item',
            icon: 'view_list',
            url: '/tourSheet',
            displayInMenu: true
          },
          {
            id: 'tonnage',
            title: 'Tonnage',
            type: 'item',
            icon: 'exposure',
            url: '/tonnage',
            exactMatch: true,
            displayInMenu: true
          },
        ],
        displayInMenu: true
      },
      {
        id: 'instancesfollow',
        title: 'Instances & suivi',
        type: 'collapsable',
        icon: 'group_work',
        children: [
          {
            id: 'followupSheet',
            title: 'Fiches de suivi',
            type: 'item',
            icon: 'assignment',
            url: '/followupSheet',
            exactMatch: true,
            displayInMenu: true
          },
          {
            id: 'meetingsCodir',
            title: 'Réunion Codir',
            type: 'item',
            icon: 'supervised_user_circle',
            url: '/meetings/1',
            exactMatch: true,
            displayInMenu: true
          },
          {
            id: 'meetingsCA',
            title: 'Réunion CA',
            type: 'item',
            icon: 'supervised_user_circle',
            url: '/meetings/2',
            exactMatch: true,
            displayInMenu: true
          },
          {
            id: 'meetingsMGT',
            title: 'Réunion Managment',
            type: 'item',
            icon: 'supervised_user_circle',
            url: '/meetings/3',
            exactMatch: true,
            displayInMenu: true
          },
          {
            id: 'lastrecap',
            title: 'Synthèse CODIR',
            type: 'item',
            icon: 'event_note',
            url: '/getLastRecap',
            exactMatch: true,
            displayInMenu: true
          },
        ],
        displayInMenu: true
      },
      {
        id: 'traceabilityandquality',
        title: 'Traça & Qualité',
        type: 'collapsable',
        icon: 'crop_rotate',
        children: [
          {
            id: 'traceability',
            title: 'Traçabilité descendante',
            type: 'item',
            icon: 'call_received',
            url: '/traceability',
            exactMatch: true,
            displayInMenu: true
          },
          {
            id: 'traceabilitysheet',
            title: 'Traçabilité ascendante',
            type: 'item',
            icon: 'call_made',
            url: '/traceabilitySheet',
            exactMatch: true,
            displayInMenu: true
          },
          {
            id: 'technicalsheet',
            title: 'Fiches Techniques',
            type: 'item',
            icon: 'assignment_turned_in',
            url: '/technicalSheet',
            exactMatch: true,
            displayInMenu: true
          },
          {
            id: 'codeshistory',
            title: 'Historique codes',
            type: 'item',
            icon: 'history',
            url: '/manageTraceabilityCodes',
            exactMatch: true,
            displayInMenu: true
          }
        ],
        displayInMenu: true
      },
      {
        id: 'partners',
        title: 'Partenaires',
        type: 'collapsable',
        icon: 'compare_arrows',
        children: [
          {
            id: 'sites',
            title: 'Gestion des sites',
            type: 'item',
            icon: 'where_to_vote',
            url: '/sites',
            displayInMenu: true
          },
          {
            id: 'clients',
            title: 'Gestion des clients',
            type: 'item',
            icon: 'monetization_on',
            url: '/clients',
            displayInMenu: true
          }
        ],
        displayInMenu: true
      },
      {
        id: 'activityparameters',
        title: 'Paramétrages',
        type: 'item',
        icon: '',
        url: '/activityParameters',
        exactMatch: true,
        displayInMenu: false
      },
      {
        id: 'monthlyMeeting',
        title: 'Réunions mensuelles',
        type: 'item',
        icon: 'group',
        url: '/monthlyMeeting',
        exactMatch: true,
        displayInMenu: true
      },
      {
        id: 'followupSheetconfiguration',
        title: 'Configuration des fiches de suivi',
        type: 'item',
        icon: '',
        url: '/followupSheet-configuration',
        exactMatch: true,
        displayInMenu: false
      },
      {
        id: 'timeline',
        title: 'Mur',
        type: 'item',
        icon: '',
        url: '/',
        exactMatch: true,
        displayInMenu: false
      }
    ],
  }];

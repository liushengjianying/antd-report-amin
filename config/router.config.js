export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/database/agent' },
      // { path: '/', redirect: '/dashboard/analysis' },
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   icon: 'dashboard',
      //   routes: [
      //     {
      //       path: '/dashboard/analysis',
      //       name: 'analysis',
      //       component: './Dashboard/Analysis',
      //     },
      //     {
      //       path: '/dashboard/monitor',
      //       name: 'monitor',
      //       component: './Dashboard/Monitor',
      //     },
      //     {
      //       path: '/dashboard/workplace',
      //       name: 'workplace',
      //       component: './Dashboard/Workplace',
      //     },
      //   ],
      // },
      // 主数据维护
      {
        path: '/database',
        name: '主数据管理',
        icon: 'robot',
        routes: [
          {
            path: '/database/agent',
            name: '代理商',
            component: './DataBase/Agent'
          },
          {
            path: '/database/shop',
            name: '门店',
            component: './DataBase/Shop'
          },
          {
            path: '/database/goods',
            name: '商品',
            component: './DataBase/Goods'
          },
          {
            path: '/database/account',
            name: '账号管理',
            icon: 'setting',
            routes: [
              {
                path: '/database/account/ba',
                name: 'BA',
                component: './DataBase/Account/BaAccount'
              },
              {
                path: '/database/account/manager',
                name: '店长',
                component: './DataBase/Account/Manager'
              },
              {
                path: '/database/account/agent',
                name: '代理商',
                component: './DataBase/Account/Agent'
              }
            ]
          },
          {
            path: '/database/report',
            name: '报表',
            icon: 'bar-chart',
            routes: [
              {
                path: '/database/report/sale',
                name: '销售报表',
                component: './DataBase/Report/Sale'
              }
            ]
          },
          // {
          //   path: '/database/importFile',
          //   name: '文件导入',
          //   component: './DataBase/ImportFile'
          // },
        ]
      },
      // 积分规则
      {
        path: '/credits',
        name: '积分',
        icon: 'codepen',
        routes: [
          {
            path: '/credits/activity',
            name: '积分活动',
            component: './Credits/Activity'
          }
        ]
      },
      // 系统管理，配置用户权限
      // {
      //   path: '/system',
      //   name: '系统管理',
      //   icon: 'windows',
      //   routes: [
      //     {
      //       path: '/system/accControl',
      //       name: '账号管理'
      //     }
      //   ]
      // },
      // forms
      // {
      //   path: '/form',
      //   icon: 'form',
      //   name: 'form',
      //   routes: [
      //     {
      //       path: '/form/basic-form',
      //       name: 'basicform',
      //       component: './Forms/BasicForm',
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'stepform',
      //       component: './Forms/StepForm',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         {
      //           path: '/form/step-form',
      //           redirect: '/form/step-form/info',
      //         },
      //         {
      //           path: '/form/step-form/info',
      //           name: 'info',
      //           component: './Forms/StepForm/Step1',
      //         },
      //         {
      //           path: '/form/step-form/confirm',
      //           name: 'confirm',
      //           component: './Forms/StepForm/Step2',
      //         },
      //         {
      //           path: '/form/step-form/result',
      //           name: 'result',
      //           component: './Forms/StepForm/Step3',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'advancedform',
      //       authority: ['admin'],
      //       component: './Forms/AdvancedForm',
      //     },
      //   ],
      // },
      // // list
      // {
      //   path: '/list',
      //   icon: 'table',
      //   name: 'list',
      //   routes: [
      //     {
      //       path: '/list/table-list',
      //       name: 'searchtable',
      //       component: './List/TableList',
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'basiclist',
      //       component: './List/BasicList',
      //     },
      //     {
      //       path: '/list/card-list',
      //       name: 'cardlist',
      //       component: './List/CardList',
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'searchlist',
      //       component: './List/List',
      //       routes: [
      //         {
      //           path: '/list/search',
      //           redirect: '/list/search/articles',
      //         },
      //         {
      //           path: '/list/search/articles',
      //           name: 'articles',
      //           component: './List/Articles',
      //         },
      //         {
      //           path: '/list/search/projects',
      //           name: 'projects',
      //           component: './List/Projects',
      //         },
      //         {
      //           path: '/list/search/applications',
      //           name: 'applications',
      //           component: './List/Applications',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   icon: 'profile',
      //   routes: [
      //     // profile
      //     {
      //       path: '/profile/basic',
      //       name: 'basic',
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/basic/:id',
      //       name: 'basic',
      //       hideInMenu: true,
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'advanced',
      //       authority: ['admin'],
      //       component: './Profile/AdvancedProfile',
      //     },
      //   ],
      // },
      // {
      //   name: 'result',
      //   icon: 'check-circle-o',
      //   path: '/result',
      //   routes: [
      //     // result
      //     {
      //       path: '/result/success',
      //       name: 'success',
      //       component: './Result/Success',
      //     },
      //     { path: '/result/fail', name: 'fail', component: './Result/Error' },
      //   ],
      // },
      // {
      //   name: 'exception',
      //   icon: 'warning',
      //   path: '/exception',
      //   routes: [
      //     // exception
      //     {
      //       path: '/exception/403',
      //       name: 'not-permission',
      //       component: './Exception/403',
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'not-find',
      //       component: './Exception/404',
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'server-error',
      //       component: './Exception/500',
      //     },
      //     {
      //       path: '/exception/trigger',
      //       name: 'trigger',
      //       hideInMenu: true,
      //       component: './Exception/TriggerException',
      //     },
      //   ],
      // },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/changePwd',
            name: '修改密码',
            component: './Account/ChangePwd/ChangePwd'
          },
          // {
          //   path: '/account/center',
          //   name: 'center',
          //   component: './Account/Center/Center',
          //   routes: [
          //     {
          //       path: '/account/center',
          //       redirect: '/account/center/articles',
          //     },
          //     {
          //       path: '/account/center/articles',
          //       component: './Account/Center/Articles',
          //     },
          //     {
          //       path: '/account/center/applications',
          //       component: './Account/Center/Applications',
          //     },
          //     {
          //       path: '/account/center/projects',
          //       component: './Account/Center/Projects',
          //     },
          //   ],
          // },
          // {
          //   path: '/account/settings',
          //   name: 'settings',
          //   component: './Account/Settings/Info',
          //   routes: [
          //     {
          //       path: '/account/settings',
          //       redirect: '/account/settings/base',
          //     },
          //     {
          //       path: '/account/settings/base',
          //       component: './Account/Settings/BaseView',
          //     },
          //     {
          //       path: '/account/settings/security',
          //       component: './Account/Settings/SecurityView',
          //     },
          //     {
          //       path: '/account/settings/binding',
          //       component: './Account/Settings/BindingView',
          //     },
          //     {
          //       path: '/account/settings/notification',
          //       component: './Account/Settings/NotificationView',
          //     },
          //   ],
          // },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];

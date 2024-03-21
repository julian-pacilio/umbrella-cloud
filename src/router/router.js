import Home from "./../pages/Home.vue";
import About from "./../pages/About.vue";
import Register from "./../pages/Register.vue";
import Login from "./../pages/Login.vue";
import Dashboard from "./../pages/Dashboard.vue";
import PrivateChat from "./../pages/PrivateChat.vue";
import Pricing from "./../pages/Pricing.vue";
import NotFound from "./../pages/NotFound.vue";
import UserProfile from "./../pages/UserProfile.vue";
import EditUser from "./../pages/EditUser.vue";
import EditAvatar from "./../pages/EditAvatar.vue";
import EditPassword from "./../pages/EditPassword.vue";
import AddService from "./../pages/AddService.vue";
import EditService from "./../pages/EditService.vue";
import DeleteService from "./../pages/DeleteService.vue";
import ManageServices from "./../pages/ManageServices.vue";
import ManageUsers from "./../pages/ManageUsers.vue";
import ManageChats from "./../pages/ManageChats.vue";
import ManageSuscription from "./../pages/ManageSuscription.vue";
import CancelSuscription from "./../pages/CancelSuscription.vue";
import UpgradeSuscription from "./../pages/UpgradeSuscription.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { suscribeToAuth } from "../services/auth";

const routes = [
  { path: "/",                          component: Home                                               },
  { path: "/quienes-somos",             component: About                                              },
  { path: "/registrarse",               component: Register                                           },
  { path: "/iniciar-sesion",            component: Login                                              },
  { path: "/pricing",                   component: Pricing                                            },
  { path: "/dashboard/:id",             component: Dashboard,             meta: { requireAuth: true } },
  { path: "/manage-services",           component: ManageServices,        meta: { requireAuth: true } },
  { path: "/add-service",               component: AddService,            meta: { requireAuth: true } },
  { path: "/edit-service/:id",          component: EditService,           meta: { requireAuth: true } },
  { path: "/delete-service/:id",        component: DeleteService,         meta: { requireAuth: true } },
  { path: "/manage-users",              component: ManageUsers,           meta: { requireAuth: true } },
  { path: "/manage-chats/:id",          component: ManageChats,           meta: { requireAuth: true } },
  { path: "/usuario/:id",               component: UserProfile,           meta: { requireAuth: true } },
  { path: "/edit-user/:id",             component: EditUser,              meta: { requireAuth: true } },
  { path: "/edit-user-avatar/:id",      component: EditAvatar,            meta: { requireAuth: true } },
  { path: "/manage-suscription/:id",    component: ManageSuscription,     meta: { requireAuth: true } },
  { path: "/cancel-suscription/:id",    component: CancelSuscription,     meta: { requireAuth: true } },
  { path: "/upgrade-suscription/:id",   component: UpgradeSuscription,    meta: { requireAuth: true } },
  { path: "/edit-password/:id",         component: EditPassword,          meta: { requireAuth: true } },
  { path: "/usuario/:id/chat",          component: PrivateChat,           meta: { requireAuth: true } },
  { path: "/:pathMatch(.*)*",           component: NotFound                                           },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

let user = {
  id: null,
  email: null,
};

suscribeToAuth((newUser) => (user = newUser));

router.beforeEach((to) => {
  if (user.id === null && to.meta.requireAuth) {
    return "/iniciar-sesion";
  }
});

export default router;

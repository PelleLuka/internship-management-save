import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
        /**
         * Dashboard (Home)
         */
		{
			path: "/",
			redirect: "/internships",
		},

        /**
         * Internships Management
         * Displays the list of interns and their details.
         */
		{
			path: "/internships",
			name: "internships",
			component: () => import("./views/InternshipDashboard.vue"),
		},

        /**
         * Activities Management
         * Displays the catalogue of activities.
         */
		{
			path: "/activities",
			name: "activities",
			component: () => import("./views/ActivityList.vue"),
		},

        /**
         * Categories Management
         * Displays the list of activity categories.
         */
		{
			path: "/categories",
			name: "categories",
			component: () => import("./views/CategoryList.vue"),
		},

        /**
         * Settings
         * Displays application settings.
         */
		{
			path: "/settings",
			name: "settings",
			component: () => import("./views/SettingsView.vue"),
		},
	],
});

export default router;

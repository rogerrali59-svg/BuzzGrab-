

const SubAdminNodes = [

    {
        label: "Users Management",
        value: "usersManagement",
        children: [
            {
                label: "Registers Users",
                value: "usersManagement.registers",
                path: "/user-list",
                children: [
                    { label: "Create", value: "usersManagement.registers.add" },
                    { label: "Update", value: "usersManagement.registers.edit" },
                    { label: "View", value: "usersManagement.registers.view" },
                    { label: "Active/In-Active", value: "usersManagement.registers.active" },
                    { label: "Delete", value: "usersManagement.registers.delete" },
                ],
            },
        ],
    },
    {
        label: "Category Management",
        value: "categoryManagement",
        children: [
            {
                label: "Category",
                value: "categoryManagement.category",
                path: "/category",
                children: [
                    { label: "Create", value: "categoryManagement.category.add" },
                    { label: "Update", value: "categoryManagement.category.edit" },
                    { label: "View", value: "categoryManagement.category.view" },
                    { label: "Active/In-Active", value: "categoryManagement.category.active" },
                    { label: "Delete", value: "categoryManagement.category.delete" },

                ],
            },
            {
                label: "Subcategory",
                value: "subcategoryManagement.subcategory",
                path: "/subcategory",
                children: [
                    { label: "Create", value: "subcategoryManagement.subcategory.add" },
                    { label: "Update", value: "subcategoryManagement.subcategory.edit" },
                    { label: "View", value: "subcategoryManagement.subcategory.view" },
                    { label: "Active/In-Active", value: "subcategoryManagement.subcategory.active" },
                    { label: "Delete", value: "subcategoryManagement.subcategory.delete" },
                ],
            },
        ],
    },

    {
        label: "Banner Management",
        value: "banner",
        path: "/banner",
        children: [
            { label: "Create", value: "banner.add" },
            { label: "Update", value: "banner.edit" },
            { label: "View", value: "banner.view" },
            { label: "Active/In-Active", value: "banner.active" },
            { label: "Delete", value: "banner.delete" },
        ],
    },

    {
        label: "Subscription Management",
        value: "subscription",
        path: "/subscription",
        children: [
            { label: "Create", value: "subscription.add" },
            { label: "Update", value: "subscription.edit" },
            { label: "View", value: "subscription.view" },
            { label: "Delete", value: "subscription.delete" },
            { label: "Active/In-Active", value: "subscription.active" },
        ],
    },

    {
        label: "Notification Management",
        value: "notification",
        path: "/notification",
        children: [
            { label: "View", value: "notification.view" },
            { label: "Delete", value: "notification.delete" },
        ],
    },

    {
        label: "Subscriptions",
        value: "subscriptions",
        path: "/subscription",
        children: [
            { label: "Add", value: "subscriptions.add" },
            { label: "Edit", value: "subscriptions.edit" },
            { label: "View", value: "subscriptions.view" },
            { label: "Delete", value: "subscriptions.delete" },
            { label: "Active/In-Active", value: "subscriptions.active" },
        ],
    },

    {
        label: "Contact Directory",
        value: "Contactdirectory",
        path: "/contact-info",
        children: [
            { label: "Add", value: "Contactdirectory.add" },
            { label: "Edit", value: "Contactdirectory.edit" },
            { label: "View", value: "Contactdirectory.view" },
            { label: "Delete", value: "Contactdirectory.delete" },
        ],
    },

    {
        label: "Report and Analytics",
        value: "reportanalytics",
        path: "/user-report",
    },

    {
        label: "Logger",
        value: "Logger",
        path: "/error-logs",
        children: [
            {
                label: "Error Logs",
                value: "Logger.errorLogs",
                path: "/error-logs",
                children: [


                    { label: "View", value: "Logger.errorLogs.view" },
                    { label: "Delete", value: "Logger.errorLogs.delete" },
                    { label: "All Delete", value: "Logger.errorLogs.alldelete" },

                ],
            },
            {
                label: "Email Queue",
                value: "Logger.emailQueue",
                path: "/email-queue",
                children: [

                    { label: "View", value: "Logger.emailQueue.view" },
                    { label: "Delete", value: "Logger.emailQueue.delete" },
                    { label: "All Delete", value: "Logger.emailQueue.alldelete" },

                ],
            },


            {
                label: "Login Activity",
                value: "Logger.LoginActivity",
                path: "/login-activity",
                children: [

                    { label: "View", value: "Logger.LoginActivity.view" },
                    { label: "All Delete", value: "Logger.LoginActivity.alldelete" },
                ],
            },
            {
                label: "SMS Logs",
                value: "Logger.smslogs",
                path: "/sms-log",
                children: [

                    { label: "View", value: "Logger.smslogs.view" },
                    { label: " Delete", value: "Logger.smslogs.delete" },
                    { label: "All Delete", value: "Logger.smslogs.alldelete" },
                ],
            },
        ],
    },

    {
        label: "Settings",
        value: "Settings",
        path: "/cms-list",
        children: [
            {
                label: "CMS",
                value: "Settings.cms",
                path: "/cms-list",
                children: [
                    { label: "Add", value: "Settings.cms.add" },
                    { label: "Edit", value: "Settings.cms.edit" },
                    { label: "Delete", value: "Settings.cms.delete" },
                    { label: "View", value: "Settings.cms.view" },
                    { label: "Active/In-active", value: "Settings.cms.active" },
                ],
            },



            {
                label: "Contactus",
                value: "Settings.contactus",
                path: "/contact-list",
                children: [

                    { label: "View", value: "Settings.contactus.view" },
                    { label: "Reply", value: "Settings.contactus.reply" },
                    { label: "Delete", value: "Settings.contactus.delete" },
                ],
            },

            {
                label: "FAQ",
                value: "Settings.faq",
                path: "/faq-list",
                children: [
                    { label: "Add", value: "Settings.faq.add" },
                    { label: "Edit", value: "Settings.faq.edit" },
                    { label: "Delete", value: "Settings.faq.delete" },
                    { label: "View", value: "Settings.faq.view" },
                    { label: "Active/In-Active", value: "Settings.faq.active" },
                ],
            },

            {
                label: "Smtp",
                value: "Settings.smtp",
                path: "/smtp-list",
                children: [
                    { label: "Add", value: "Settings.smtp.add" },
                    { label: "Edit", value: "Settings.smtp.edit" },
                    { label: "Delete", value: "Settings.smtp.delete" },
                    { label: "View", value: "Settings.smtp.view" },
                ],
            },

            {
                label: "Twillio",
                value: "Settings.twillio",
                path: "/twillio-list",
                children: [
                    { label: "Add", value: "Settings.twillio.add" },
                    { label: "Edit", value: "Settings.twillio.edit" },
                    { label: "Delete", value: "Settings.twillio.delete" },
                    { label: "View", value: "Settings.twillio.view" },
                ],
            },
            {
                label: "Backup",
                value: "Settings.backup",
                path: "/backup",
                children: [
                    { label: "Create", value: "Settings.backup.add" },
                    { label: "Download", value: "Settings.backup.download" },
                    { label: "Delete", value: "Settings.backup.delete" },
                ],
            },
        ],
    },
];
export default SubAdminNodes;
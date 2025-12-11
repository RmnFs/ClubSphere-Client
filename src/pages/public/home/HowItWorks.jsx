import { motion } from "framer-motion";
import { UserPlus, Search, CalendarCheck } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <UserPlus size={40} />,
            title: "Create Account",
            description: "Sign up deeply to access tailored club recommendations and manage your profile."
        },
        {
            icon: <Search size={40} />,
            title: "Find Communities",
            description: "Browse through diverse clubs ranging from tech to arts, and find your tribe."
        },
        {
            icon: <CalendarCheck size={40} />,
            title: "Join Events",
            description: "Register for exclusive events, workshops, and meetups happening near you."
        }
    ];

    return (
        <section className="py-16 bg-base-200/50 rounded-3xl my-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">How It Works</h2>
                <p className="text-base-content/70">Three simple steps to start your journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="flex flex-col items-center text-center p-6 bg-base-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-4 bg-primary/10 text-primary rounded-full mb-6">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-base-content/70">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;

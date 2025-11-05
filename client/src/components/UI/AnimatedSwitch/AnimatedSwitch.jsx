import React from "react";
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedSwitch = ({ condition, firstComponent, secondComponent, animation = { duration: 0.2 }, mode = "wait" }) => {
    return (
        <AnimatePresence mode={mode}>
            {condition ? (
                <motion.div
                    key="first"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: animation.duration }}
                >
                    {firstComponent}
                </motion.div>
            ) : (
                <motion.div
                    key="second"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: animation.duration }}
                >
                    {secondComponent}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AnimatedSwitch;
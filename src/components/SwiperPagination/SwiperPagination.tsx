import React from 'react';
import styles from './swiperPagination.module.scss';

interface CustomPaginationProps {
    totalSlides: number;
    activeIndex: number;
    onBulletClick: (index: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ totalSlides, activeIndex, onBulletClick }) => {
    return (
        <div className={styles.customPagination}>
            {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                    key={index}
                    className={`${styles.bullet} ${index === activeIndex ? styles.active : ''}`}
                    onClick={() => onBulletClick(index)}
                />
            ))}
        </div>
    );
};

export default CustomPagination;

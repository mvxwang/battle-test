import styles from './styles.module.css'
import { Bar } from '../Bar';
const red = '#821200';
const blue = '#1953cb';

export const PlayerSummary = ({ main = false, name, level, health, maxHealth }) => {
    return (
        <div 
            style = {{ backgroundColor: main ? blue : red }}
            className={styles.main} 
        >
            <div className={styles.info}>
                <div className={styles.name}>{name}</div>
                <div className={styles.level}>Lvl: {level}</div>
            </div>

            <div className={styles.health}>
                <Bar label="HP" value={health} maxValue={maxHealth} />
            </div>

        </div>
    );
};
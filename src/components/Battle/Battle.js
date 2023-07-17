import styles from './styles.module.css';
import { PlayerSummary } from '../PlayerSummary';
import { opponentStats, playerStats } from '../../shared/characters';
import { useEffect, useState } from 'react';
import { BattleMenu } from '../BattleMenu';
import { BattleAnnouncer } from '../BattleAnnouncer';
import { useAIOpponent } from '../../hooks';
import { useBattleSequence } from '../../hooks/useBattleSequence';
import { wait } from '../../shared';

export const Battle = ({ onGameEnd }) => {
    const [sequence, setSequence] = useState()

    const {
        turn,
        inSequence,
        playerHealth,
        opponentHealth,
        announcerMessage,
        playerAnimation,
        opponentAnimation,

    } = useBattleSequence(sequence)

    useEffect(() => {
        if (aiChoice && turn === 1 && !inSequence) {
            setSequence({ turn, mode: aiChoice})
        }
    })

    useEffect(() => {
        if (playerHealth === 0 || opponentHealth === 0) {
            (async () => {
                await wait(1000);
                onGameEnd(playerHealth === 0 ? opponentStats : playerStats);
            })();
        }
    }, [playerHealth, opponentHealth, onGameEnd]);

    const aiChoice = useAIOpponent(turn);
    return (
        <>
            <div className={styles.opponent}>
                <div className={styles.summary}>
                    <PlayerSummary
                        health={opponentHealth}
                        main={false}
                        name={opponentStats.name}
                        level={opponentStats.level}
                        maxHealth={opponentStats.maxHealth}
                    />
                </div>
            </div>

            <div className={styles.characters}>
                <div claaName={styles.gameHeader}>
                    {playerStats.name} vs {opponentStats.name}
                </div>

                <div className={styles.gameImages}>
                    <div className={styles.playerSprite}>
                        <img
                            alt={playerStats.name}
                            src={playerStats.img}
                            className={styles[playerAnimation]}
                        />
                    </div>

                    <div className={styles.opponentSprite}>
                        <img
                            src={opponentStats.img}
                            alt={opponentStats.name}
                            className={styles[opponentAnimation]}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.user}>
                <div className={styles.summary}>
                    <PlayerSummary
                        main={true}
                        health={playerHealth}
                        name={playerStats.name}
                        level={playerStats.level}
                        maxHealth={playerStats.maxHealth}
                    />
                </div>
            </div>
            <div className={styles.hud}>
                <div className={styles.hudChild}>
                    <BattleAnnouncer
                        message={
                            announcerMessage || `What will ${playerStats.name} do?`
                        }
                    />
                </div>

                <div className={styles.hudChild}>
                    <BattleMenu
                        onAttack={() => setSequence({ turn, mode: 'attack'})}
                        onMagic={() => setSequence({ turn, mode: 'magic'})}
                        onHeal={() => setSequence({ turn, mode: 'heal'})}
                    />
                </div>
            </div>
        </>
    );
};


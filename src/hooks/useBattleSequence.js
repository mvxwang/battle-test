import { useEffect, useState } from "react";
import { opponentStats, playerStats } from "../shared";
import { attack, magic, heal } from "../shared";
import { wait } from "../shared";


export const useBattleSequence = (sequence = {}) => {
    const [turn, setTurn] = useState(0);
    const [inSequence, setInSequence] = useState(false);
    const [opponentHealth, setOpponentHealth] = useState(opponentStats.maxHealth);
    const [playerHealth, setPlayerHealth] = useState(playerStats.maxHealth);
    const [announcerMessage, setAnnouncerMessage] = useState();
    const [playerAnimation, setPlayerAnimation] = useState('static');
    const [opponentAnimation, setOpponentAnimation] = useState('static')

    useEffect(() => {
        const { mode, turn } = sequence;

        if (mode) {
            // Who is the attacker and who is the receiver, based on the turn?
            const attacker = turn === 0 ? playerStats : opponentStats;
            const receiver = turn === 0 ? opponentStats : playerStats;

            switch (mode) {
                case 'attack':
                    // Damage Calculation
                    const damage = attack({ attacker, receiver });
                    // Enter the Battle Sequence
                    (async () => {
                        setInSequence(true);
                        setAnnouncerMessage(`${attacker.name} has chosen to attack!`)

                        await wait (1000);
                        // Set Animation to Attack
                        turn === 0 
                            ? setPlayerAnimation('attack') 
                            : setOpponentAnimation('attack');
                        await wait(100);
                        // Set Animation back to static
                        turn === 0
                            ? setPlayerAnimation('static')
                            : setOpponentAnimation('static')
                        await wait(500);
                        // Set Receiver Animation to Being Damaged
                        turn === 0
                            ? setOpponentAnimation('damage')
                            : setPlayerAnimation('damage')
                        await wait(750);
                        // Set Receiver Animation back to static
                        turn === 0
                            ? setOpponentAnimation('static')
                            : setPlayerAnimation('static')
                        setAnnouncerMessage(`${receiver.name} has taken damage!`);
                        // Calculate Damage
                        turn === 0
                            ? setOpponentHealth(h => (h - damage > 0 ? h - damage : 0))
                            : setPlayerHealth(h => ( h - damage > 0 ? h - damage : 0));
                        await wait (2000);

                        setAnnouncerMessage(`Now it's ${receiver.name} turn!`)
                        await wait (1500);
                        //Switch turns
                        setTurn(turn === 0 ? 1 : 0);
                        setInSequence(false)
                        // Exit Battle Sequence
                    })();
                    break;
                case 'magic': {
                    const damage = magic({ attacker, receiver });
            
                    (async () => {
                        setInSequence(true);
                        setAnnouncerMessage(`${attacker.name} has cast a spell!`);
                        await wait(1000);
            
                        turn === 0
                        ? setPlayerAnimation('magic')
                        : setOpponentAnimation('magic');
                        await wait(1000);
            
                        turn === 0
                        ? setPlayerAnimation('static')
                        : setOpponentAnimation('static');
                        await wait(500);
            
                        turn === 0
                        ? setOpponentAnimation('damage')
                        : setPlayerAnimation('damage');
                        await wait(750);
            
                        turn === 0
                        ? setOpponentAnimation('static')
                        : setPlayerAnimation('static');
                        setAnnouncerMessage(
                        `${receiver.name} was hit by a magical attack!`,
                        );
                        turn === 0
                        ? setOpponentHealth(h => (h - damage > 0 ? h - damage : 0))
                        : setPlayerHealth(h => (h - damage > 0 ? h - damage : 0)); // We don't want a negative HP.
                        await wait(2500);
            
                        setAnnouncerMessage(`Now it's ${receiver.name}'s turn!`);
                        await wait(1500);
            
                        setTurn(turn === 0 ? 1 : 0);
                        setInSequence(false);
                    })();
            
                    break;
                    }
            
                    case 'heal': {
                    const recovered = heal({ receiver: attacker });
            
                    (async () => {
                        setInSequence(true);
                        setAnnouncerMessage(`${attacker.name} has chosen to heal!`);
                        await wait(1000);
            
                        turn === 0
                        ? setPlayerAnimation('magic')
                        : setOpponentAnimation('magic');
                        await wait(1000);
            
                        turn === 0
                        ? setPlayerAnimation('static')
                        : setOpponentAnimation('static');
                        await wait(500);
            
                        setAnnouncerMessage(`${attacker.name} has recovered health.`);
                        turn === 0
                        ? setPlayerHealth(h =>
                            h + recovered <= attacker.maxHealth
                                ? h + recovered
                                : attacker.maxHealth,
                            )
                        : setOpponentHealth(h =>
                            h + recovered <= attacker.maxHealth
                                ? h + recovered
                                : attacker.maxHealth,
                            ); // We don't want to set HP more than the max
                        await wait(2500);
            
                        setAnnouncerMessage(`Now it's ${receiver.name}'s turn!`);
                        await wait(1500);
            
                        setTurn(turn === 0 ? 1 : 0);
                        setInSequence(false);
                    })();
            
                    break;
                    }
            
                    default:
                        break;
            }
        }
        },[sequence]);


    return {
        turn,
        inSequence,
        playerHealth,
        opponentHealth,
        announcerMessage,
        playerAnimation,
        opponentAnimation
    };
}
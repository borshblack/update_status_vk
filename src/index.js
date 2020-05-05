require('dotenv').config();

const easyvk = require('easyvk');
const chalk = require('chalk');
const log = console.log;

easyvk({
    username: '+79005561260',
    password: process.env.VK_MY_ACCOUNT_PASSWORD,
    fields: 'status',
    reauth: true,
}).then(async vk => {
    const { user_id, first_name, last_name, status } = vk.session;
    const statusLeftDay = initStatusLeftDay(new Date(2020, 4, 13));
    const newStatus = statusLeftDay.getStatus('_', '&#10084;', '&#128694;');

    await vk.call('account.saveProfileInfo', {
        status: newStatus,
    });
}).catch(err => {
    console.error(err);
})

function initStatusLeftDay(toDate) {
    const fromDay = new Date(Date.now()).getTime();
    const toDay =  toDate.getTime();
    const leftDayMillisecond = Math.ceil(Math.abs(toDay - fromDay));
    const dateLeftDay = new Date(leftDayMillisecond);
    const leftDay = dateLeftDay.getDate();

    function getUnicodeSmileByNumber(number) {
        let arrayHexSmile = [];
        const strNumber = new String(number);
        for (let i = 0; i < strNumber.length; i++) {
            arrayHexSmile[i] = `${strNumber[i]}&#8419;`;
        }
        
        return arrayHexSmile.join('');
    }
    
    return {
        getStatus: (splitChar, afterGoalSmile, beforeGoalSmile) => {
            let status = '';
            // Если разница в днях не превышает текующий месяц
            if (dateLeftDay.getMonth() === 0) {
                const lenSplitChar = leftDay;
                const isEven = lenSplitChar % 2 == 0;
                const lenHalf = !isEven ? Math.floor(lenSplitChar / 2) : lenSplitChar / 2;
                
                status = afterGoalSmile;
                for (let i = 0; i < lenHalf; i ++) { status += splitChar; }            
                status += getUnicodeSmileByNumber(leftDay);
                for (let i = 0; i < (!isEven ? lenHalf - 1 : lenHalf); i ++) { status += splitChar; }
                status += beforeGoalSmile;
            }

            return status;
        }
    }
}
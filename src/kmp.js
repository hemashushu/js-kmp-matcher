/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class KMP {
    /**
     * 生成最大公共前后缀表
     *
     * 前缀：即最后一个字符之外的其他字符的任意长度的组合
     * 后缀：即第一个字符之外的其他字符的任意长度的组合
     *
     * 例如：
     * 'aa' 的公共前后缀是：
     * 'a|a'
     * ..'a|a'
     * ...^------- 'a' 是公共前后缀
     *
     * 'abab' 的公共前后缀是：
     * 'ab|ab'
     * ...'ab|ab'
     *     ^^----- 'ab' 是公共前后缀
     *
     * @param {*} keyword
     */
    static makePartialMatchTable(keywordChars) {
        let length = keywordChars.length;

        // table 数组用于记录当 keyword 取不同长度时的最大公共前后缀的长度。
        // keyword 的长度从 1 取到 length

        // table 数组的长度显然是 length
        let table = new Array(length);
        table.fill(0, 0);

        let i = 1;
        let j = 0;

        // 下面的是河马蜀黍自己乱想出来的实物演示法😅，动手做一下可以帮助理解：
        //
        // 准备一条纸条，宽度为 1cm，长度为关键字字符的长度（即 `length` cm），然后
        // 每一格（cm）填上一个字母。这时这条纸条就是关键字字符数组。
        //
        // 关键字可以参考下面几个有代表性的：
        //
        // - 'abaab'
        // - 'aaaab'
        // - 'aabaaa'
        // - 'abcdabd'
        //
        // 复制一条一模一样的纸条。
        //
        // 将两条纸条一上一下平铺，然后左右错开一格，再逐渐拉开，每次拉开一格，直到只剩下还连着一格为止，
        // 在拉开的过程中找到上下两条纸条内容重叠/相同的位置，这个重叠的长度就是 "最大公共前后缀长度"。
        //
        // 然后折掉最右边一格，重复上面的步骤，找到长度为 length - 1 时的 "最大公共前后缀长度"。
        //
        // 不断折掉最右边的一格，直到只剩下 2 格为止，找到所有长度下的  "最大公共前后缀长度"。
        // （因为 1 个字符不存在前缀或后缀，所以不需要减到 1 个字符）。
        //
        // 实际计算时并不需要重复计算每一个长度的情况，只需计算一次最长的长度即可，因为由
        // 上面的演示可见，不同长度的前面的步骤都是 **一模一样** 的。
        //
        // 程序的过程如下：
        //
        // 如果 i （上纸条当前比较的字符的位置） 和 j （下纸条当前比较字符的位置） 的字符：
        // 1. 不同：
        // a. 如果 j == 0，则 i++
        // b. 如果 j != 0, 有两种方式：
        //    I.  暴力搜索法：
        //        将 i 退回到第 i-j+1，即 i 和 j 第一次相同的后一个字符；
        //        将 j 退回到 0。
        //    II. 迷你 KMP 的现做现用，因为目前 table （尽管还不完整）已经记录了部分头尾相同的子字符串，
        //        j 不需要退回到 0，只需要将 j 退回到 table[j-1] 即可，即跳过头尾相同字符中间的那些必然不会匹配的字符。
        //        i 保持不变。
        // 2. 相同：则 i++, j++
        //
        // 在计算过程中，`j` 的值就是关键字子字符串长度为 `i` 时的 "最大公共前后缀长度" 。

        while (i < length) {
            if (keywordChars[i] !== keywordChars[j]) {
                if (j === 0) {
                    table[i] = 0
                    i++;
                } else {
                    // 这是暴力构建法：
                    // i = i - j + 1;
                    // j = 0;

                    // 这是现做现用的迷你 KMP 法：
                    j = table[j - 1];
                }

            } else {
                table[i] = j + 1;
                i++;
                j++;
            }
        }

        return table;
    }

    static find(testStr, keywordStr) {
        let testChars = KMP.stringToChars(testStr);
        let testLength = testChars.length;

        let keywordChars = KMP.stringToChars(keywordStr);
        let keywordLength = keywordChars.length;

        let table = KMP.makePartialMatchTable(keywordChars);

        let i = 0;
        let j = 0;

        while (i < testLength) {
            if (testChars[i] === keywordChars[j]) {
                // 这里同暴力搜索
                i++;
                j++;

                if (j === keywordLength) {
                    break;
                }

            } else {
                // 这里跟暴力搜索不同，暴力搜索遇到一个不相同的字符时：
                // i 会退回到 i-j+1，即 i 和 j 第一次相同字符的后一个字符
                // j 会退回到 0

                // 而 KMP 搜索的方法是：
                // i 保持不变
                // j 退回到 table[j-1]，即跳过有重复头尾的部分。
                if (j > 0) {
                    j = table[j - 1]; // 跳过当前 j 长度的关键字子字符串头尾重复的部分
                } else {
                    i++;
                }
            }
        }

        return (i === testLength) ? -1 : (i - keywordLength);
    }

    static stringToChars(str) {
        let chars = [];
        for (let c of str) {
            chars.push(c);
        }
        return chars;
    }
}

export { KMP };
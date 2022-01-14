/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * KMP 字符串查找法的简单思想：
 * 1. 假设关键字字符串里存在有头尾重复（头尾一样）的子字符串；
 * 2. 在暴力搜索的基础上，每当遇到字符不匹配的时候，跳过关键字当中有头尾重复的部分，以节省
 *    这部分的比较时间。
 * 3. 如果关键字字符串里不存在任何头尾重复的子字符串（搜索中文关键字时大机率如此），实际上仍然是
 *    暴力搜索。
 *
 * 其中：
 * 子字符串是指从位置 0 开始，到每个不同的长度的部分，比如 0~1 是一个子串，
 * 0~2 是一个子串, 0~(N-1) 也是一个子串。
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

        // table 数组记录当 keyword 取不同长度时的最大公共前后缀的长度。
        // keyword 的长度从 1 取到 length
        // 所以 table 数组的长度是 length

        let table = new Array(length);
        table.fill(0, 0);

        let i = 1;
        let j = 0;

        // 下面的是河马蜀黍自己乱想出来的实物演示法😅，动手做一下可以很快理解：
        //
        // 准备一条纸条，宽度为 1cm，长度为 keyword length cm，然后每一格（cm）填上一个字母。
        // 这时这条纸条就是关键字字符数组。
        //
        // 参考关键字：
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
        // 如果 i （上纸条当前比较的字符的位置） 和 j （下纸条当前比较字符的位置） 的字符：
        // 1. 不同：
        //    a. 如果 j == 0，则 i++
        //    b. 如果 j != 0, 有两种方式：
        //       I.  类似暴力搜索，
        //           将 i 退回到第 i-j+1，即 i 和 j 第一次相同的后一个字符，
        //           将 j 退回到 0。
        //       II. KMP 的现做现用，因为就目前（还不完整的）table 已经记录了部分头尾相同的子字符串，
        //           所以只需要将 j 退回到 table[j-1]，跳过头尾相同的部分即可。
        //           i 保持不变，且 j 不需要退回到 0。
        // 2. 相同：则 i++, j++

        while (i < length) {
            if (keywordChars[i] !== keywordChars[j]) {
                if (j === 0) {
                    table[i] = 0
                    i++;
                } else {
                    // 这是暴力构建法：
                    // i = i - j + 1;
                    // j = 0;

                    // 这是现做现用的 KMP 法：
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
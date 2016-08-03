/**
 * Qoopido.demand plugin/sri
 *
 * Based on jsSHA:
 *   Repo:    https://github.com/Caligatio/jsSHA
 *   License: https://github.com/Caligatio/jsSHA/blob/master/LICENSE
 *
 * Copyright (c) 2016 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

(function() {
	'use strict';

	var maxByte1 = 0xFFFF,
		maxByte2 = 0xFFFFFFFF,
		b64Tab   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
		Ksha2 = [
			0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
			0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
			0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
			0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
			0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
			0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
			0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
			0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
			0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
			0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
			0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
			0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
			0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
			0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
			0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
			0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
		],
		Ksha512 = [
			new Int64(Ksha2[ 0], 0xd728ae22), new Int64(Ksha2[ 1], 0x23ef65cd),
			new Int64(Ksha2[ 2], 0xec4d3b2f), new Int64(Ksha2[ 3], 0x8189dbbc),
			new Int64(Ksha2[ 4], 0xf348b538), new Int64(Ksha2[ 5], 0xb605d019),
			new Int64(Ksha2[ 6], 0xaf194f9b), new Int64(Ksha2[ 7], 0xda6d8118),
			new Int64(Ksha2[ 8], 0xa3030242), new Int64(Ksha2[ 9], 0x45706fbe),
			new Int64(Ksha2[10], 0x4ee4b28c), new Int64(Ksha2[11], 0xd5ffb4e2),
			new Int64(Ksha2[12], 0xf27b896f), new Int64(Ksha2[13], 0x3b1696b1),
			new Int64(Ksha2[14], 0x25c71235), new Int64(Ksha2[15], 0xcf692694),
			new Int64(Ksha2[16], 0x9ef14ad2), new Int64(Ksha2[17], 0x384f25e3),
			new Int64(Ksha2[18], 0x8b8cd5b5), new Int64(Ksha2[19], 0x77ac9c65),
			new Int64(Ksha2[20], 0x592b0275), new Int64(Ksha2[21], 0x6ea6e483),
			new Int64(Ksha2[22], 0xbd41fbd4), new Int64(Ksha2[23], 0x831153b5),
			new Int64(Ksha2[24], 0xee66dfab), new Int64(Ksha2[25], 0x2db43210),
			new Int64(Ksha2[26], 0x98fb213f), new Int64(Ksha2[27], 0xbeef0ee4),
			new Int64(Ksha2[28], 0x3da88fc2), new Int64(Ksha2[29], 0x930aa725),
			new Int64(Ksha2[30], 0xe003826f), new Int64(Ksha2[31], 0x0a0e6e70),
			new Int64(Ksha2[32], 0x46d22ffc), new Int64(Ksha2[33], 0x5c26c926),
			new Int64(Ksha2[34], 0x5ac42aed), new Int64(Ksha2[35], 0x9d95b3df),
			new Int64(Ksha2[36], 0x8baf63de), new Int64(Ksha2[37], 0x3c77b2a8),
			new Int64(Ksha2[38], 0x47edaee6), new Int64(Ksha2[39], 0x1482353b),
			new Int64(Ksha2[40], 0x4cf10364), new Int64(Ksha2[41], 0xbc423001),
			new Int64(Ksha2[42], 0xd0f89791), new Int64(Ksha2[43], 0x0654be30),
			new Int64(Ksha2[44], 0xd6ef5218), new Int64(Ksha2[45], 0x5565a910),
			new Int64(Ksha2[46], 0x5771202a), new Int64(Ksha2[47], 0x32bbd1b8),
			new Int64(Ksha2[48], 0xb8d2d0c8), new Int64(Ksha2[49], 0x5141ab53),
			new Int64(Ksha2[50], 0xdf8eeb99), new Int64(Ksha2[51], 0xe19b48a8),
			new Int64(Ksha2[52], 0xc5c95a63), new Int64(Ksha2[53], 0xe3418acb),
			new Int64(Ksha2[54], 0x7763e373), new Int64(Ksha2[55], 0xd6b2b8a3),
			new Int64(Ksha2[56], 0x5defb2fc), new Int64(Ksha2[57], 0x43172f60),
			new Int64(Ksha2[58], 0xa1f0ab72), new Int64(Ksha2[59], 0x1a6439ec),
			new Int64(Ksha2[60], 0x23631e28), new Int64(Ksha2[61], 0xde82bde9),
			new Int64(Ksha2[62], 0xb2c67915), new Int64(Ksha2[63], 0xe372532b),
			new Int64(0xca273ece, 0xea26619c), new Int64(0xd186b8c7, 0x21c0c207),
			new Int64(0xeada7dd6, 0xcde0eb1e), new Int64(0xf57d4f7f, 0xee6ed178),
			new Int64(0x06f067aa, 0x72176fba), new Int64(0x0a637dc5, 0xa2c898a6),
			new Int64(0x113f9804, 0xbef90dae), new Int64(0x1b710b35, 0x131c471b),
			new Int64(0x28db77f5, 0x23047d84), new Int64(0x32caab7b, 0x40c72493),
			new Int64(0x3c9ebe0a, 0x15c9bebc), new Int64(0x431d67c4, 0x9c100d4c),
			new Int64(0x4cc5d4be, 0xcb3e42b6), new Int64(0x597f299c, 0xfc657e2a),
			new Int64(0x5fcb6fab, 0x3ad6faec), new Int64(0x6c44198c, 0x4a475817)
		];


	function Int64(msint_32, lsint_32) {
		this.h = msint_32;
		this.l  = lsint_32;
	}

	function add322(a, b) {
		var lsw = (a & maxByte1) + (b & maxByte1),
			msw = (a >>> 16) + (b >>> 16) + (lsw >>> 16);

		return ((msw & maxByte1) << 16) | (lsw & maxByte1);
	}

	function add324(a, b, c, d) {
		var lsw = (a & maxByte1) + (b & maxByte1) + (c & maxByte1) + (d & maxByte1),
			msw = (a >>> 16) + (b >>> 16) + (c >>> 16) + (d >>> 16) + (lsw >>> 16);

		return ((msw & maxByte1) << 16) | (lsw & maxByte1);
	}

	function add325(a, b, c, d, e) {
		var lsw = (a & maxByte1) + (b & maxByte1) + (c & maxByte1) + (d & maxByte1) + (e & maxByte1),
			msw = (a >>> 16) + (b >>> 16) + (c >>> 16) + (d >>> 16) + (e >>> 16) + (lsw >>> 16);

		return ((msw & maxByte1) << 16) | (lsw & maxByte1);
	}

	function add642(x, y) {
		var lsw, msw, lowOrder, highOrder;

		lsw       = (x.l & maxByte1) + (y.l & maxByte1);
		msw       = (x.l >>> 16) + (y.l >>> 16) + (lsw >>> 16);
		lowOrder  = ((msw & maxByte1) << 16) | (lsw & maxByte1);

		lsw       = (x.h & maxByte1) + (y.h & maxByte1) + (msw >>> 16);
		msw       = (x.h >>> 16) + (y.h >>> 16) + (lsw >>> 16);
		highOrder = ((msw & maxByte1) << 16) | (lsw & maxByte1);

		return new Int64(highOrder, lowOrder);
	}

	function add644(a, b, c, d) {
		var lsw, msw, lowOrder, highOrder;

		lsw       = (a.l & maxByte1) + (b.l & maxByte1) + (c.l & maxByte1) + (d.l & maxByte1);
		msw       = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (lsw >>> 16);
		lowOrder  = ((msw & maxByte1) << 16) | (lsw & maxByte1);

		lsw       = (a.h & maxByte1) + (b.h & maxByte1) + (c.h & maxByte1) + (d.h & maxByte1) + (msw >>> 16);
		msw       = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (lsw >>> 16);
		highOrder = ((msw & maxByte1) << 16) | (lsw & maxByte1);

		return new Int64(highOrder, lowOrder);
	}

	function add645(a, b, c, d, e) {
		var lsw, msw, lowOrder, highOrder;

		lsw       = (a.l & maxByte1) + (b.l & maxByte1) + (c.l & maxByte1) + (d.l & maxByte1) + (e.l & maxByte1);
		msw       = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (e.l >>> 16) + (lsw >>> 16);
		lowOrder  = ((msw & maxByte1) << 16) | (lsw & maxByte1);

		lsw       = (a.h & maxByte1) + (b.h & maxByte1) + (c.h & maxByte1) + (d.h & maxByte1) + (e.h & maxByte1) + (msw >>> 16);
		msw       = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (e.h >>> 16) + (lsw >>> 16);
		highOrder = ((msw & maxByte1) << 16) | (lsw & maxByte1);

		return new Int64(highOrder, lowOrder);
	}

	function gamma032(x) {
		return rotr32(x, 7) ^ rotr32(x, 18) ^ shr32(x, 3);
	}

	function gamma132(x) {
		return rotr32(x, 17) ^ rotr32(x, 19) ^ shr32(x, 10);
	}

	function gamma064(x) {
		var rotr1 = rotr64(x, 1),
			rotr8 = rotr64(x, 8),
			shr7  = shr64(x, 7);

		return new Int64(
			rotr1.h ^ rotr8.h ^ shr7.h,
			rotr1.l ^ rotr8.l ^ shr7.l
		);
	}

	function gamma164(x) {
		var rotr19 = rotr64(x, 19),
			rotr61 = rotr64(x, 61),
			shr6   = shr64(x, 6);

		return new Int64(
			rotr19.h ^ rotr61.h ^ shr6.h,
			rotr19.l ^ rotr61.l ^ shr6.l
		);
	}

	function sigma032(x) {
		return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
	}

	function sigma132(x) {
		return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
	}

	function sigma064(x) {
		var rotr28 = rotr64(x, 28),
			rotr34 = rotr64(x, 34),
			rotr39 = rotr64(x, 39);

		return new Int64(
			rotr28.h ^ rotr34.h ^ rotr39.h,
			rotr28.l ^ rotr34.l ^ rotr39.l
		);
	}

	function sigma164(x) {
		var rotr14 = rotr64(x, 14),
			rotr18 = rotr64(x, 18),
			rotr41 = rotr64(x, 41);

		return new Int64(
			rotr14.h ^ rotr18.h ^ rotr41.h,
			rotr14.l ^ rotr18.l ^ rotr41.l
		);
	}

	function maj32(x, y, z) {
		return (x & y) ^ (x & z) ^ (y & z);
	}

	function maj64(x, y, z) {
		return new Int64(
			(x.h & y.h) ^ (x.h & z.h) ^ (y.h & z.h),
			(x.l & y.l) ^ (x.l & z.l) ^ (y.l & z.l)
		);
	}

	function ch32(x, y, z) {
		return (x & y) ^ (~x & z);
	}

	function ch64(x, y, z) {
		return new Int64(
			(x.h & y.h) ^ (~x.h & z.h),
			(x.l & y.l) ^ (~x.l & z.l)
		);
	}

	function rotr32(x, n) {
		return (x >>> n) | (x << (32 - n));
	}

	function rotr64(x, n) {
		var result = null, tmp = new Int64(x.h, x.l);

		if(32 >= n) {
			result = new Int64(
				(tmp.h >>> n) | ((tmp.l << (32 - n)) & maxByte2),
				(tmp.l >>> n) | ((tmp.h << (32 - n)) & maxByte2)
			);
		} else {
			result = new Int64(
				(tmp.l >>> (n - 32)) | ((tmp.h << (64 - n)) & maxByte2),
				(tmp.h >>> (n - 32)) | ((tmp.l << (64 - n)) & maxByte2)
			);
		}

		return result;
	}

	function shr32(x, n) {
		return x >>> n;
	}

	function shr64(x, n) {
		var result = null;

		if(32 >= n) {
			result = new Int64(
				x.h >>> n,
				x.l >>> n | ((x.h << (32 - n)) & maxByte2)
			);
		} else {
			result = new Int64(
				0,
				x.h >>> (n - 32)
			);
		}

		return result;
	}

	function str2binb(str, existingBin, existingBinLen) {
		var i = 0, strLength = str.length, byteCnt = 0, binArr, bin, binLength, binArrLength, existingByteLen, codePnt, j, intOffset, byteOffset;

		bin             = existingBin || [ 0 ];
		existingBinLen  = existingBinLen || 0;
		existingByteLen = existingBinLen >>> 3;

		for(; i < strLength; i++) {
			codePnt = str.charCodeAt(i);
			binArr  = [];

			if (0x80 > codePnt) {
				binArr.push(codePnt);
			} else if (0x800 > codePnt) {
				binArr.push(0xC0 | (codePnt >>> 6));
				binArr.push(0x80 | (codePnt & 0x3F));
			} else if ((0xd800 > codePnt) || (0xe000 <= codePnt)) {
				binArr.push(
					0xe0 | (codePnt >>> 12),
					0x80 | ((codePnt >>> 6) & 0x3f),
					0x80 | (codePnt & 0x3f)
				);
			} else {
				i++;
				codePnt = 0x10000 + (((codePnt & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));

				binArr.push(
					0xf0 | (codePnt >>> 18),
					0x80 | ((codePnt >>> 12) & 0x3f),
					0x80 | ((codePnt >>> 6) & 0x3f),
					0x80 | (codePnt & 0x3f)
				);
			}

			binLength    = bin.length;
			binArrLength = binArr.length;

			for(j = 0; j < binArrLength; j++) {
				byteOffset = byteCnt + existingByteLen;
				intOffset  = byteOffset >>> 2;

				while(binLength <= intOffset) {
					bin.push(0);

					binLength++;
				}

				bin[intOffset] |= binArr[j] << (8 * (3 - (byteOffset % 4)));

				byteCnt++;
			}
		}

		return { 'value': bin, 'length' : byteCnt * 8 + existingBinLen };
	}

	function binb2b64(binarray) {
		var result = '', length = binarray.length * 4, lengthTotal, i = 0, triplet, offset, int1, int2, j;

		for(; i < length; i += 3) {
			lengthTotal = binarray.length;

			offset  = (i + 1) >>> 2;
			int1    = (lengthTotal <= offset) ? 0 : binarray[offset];
			offset  = (i + 2) >>> 2;
			int2    = (lengthTotal <= offset) ? 0 : binarray[offset];
			triplet = (((binarray[i >>> 2] >>> 8 * (3 - i % 4)) & 0xFF) << 16) | (((int1 >>> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((int2 >>> 8 * (3 - (i + 2) % 4)) & 0xFF);

			for(j = 0; j < 4; j++) {
				if(i * 8 + j * 6 <= lengthTotal * 32) {
					result += b64Tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
				} else {
					result += '=';
				}
			}
		}

		return result;
	}

	function getH(variant) {
		var full = [
				0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
				0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
			],
			trunc = [
				0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
				0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
			],
			result;

		switch(variant) {
			case 'sha256':
				result = full;

				break;
			case 'sha384':
				result = [
					new Int64(0xcbbb9d5d, trunc[0]),
					new Int64(0x0629a292a, trunc[1]),
					new Int64(0x9159015a, trunc[2]),
					new Int64(0x0152fecd8, trunc[3]),
					new Int64(0x67332667, trunc[4]),
					new Int64(0x98eb44a87, trunc[5]),
					new Int64(0xdb0c2e0d, trunc[6]),
					new Int64(0x047b5481d, trunc[7])
				];

				break;
			case 'sha512':
				result = [
					new Int64(full[0], 0xf3bcc908),
					new Int64(full[1], 0x84caa73b),
					new Int64(full[2], 0xfe94f82b),
					new Int64(full[3], 0x5f1d36f1),
					new Int64(full[4], 0xade682d1),
					new Int64(full[5], 0x2b3e6c1f),
					new Int64(full[6], 0xfb41bd6b),
					new Int64(full[7], 0x137e2179)
				];

				break;
			}

		return result;
	}

	function roundSHA2(block, H, variant)
	{
		var blockLength = block.length, t = 0, a, b, c, d, e, f, g, h, T1, T2, numRounds, binaryStringMult,
			add2, add4, add5, gamma0, gamma1, sigma0, sigma1,
			ch, maj, Int, W = [], int1, int2, offset, K;

		switch(variant) {
			case 'sha256':
				numRounds        = 64;
				binaryStringMult = 1;
				Int              = Number;
				add2             = add322;
				add4             = add324;
				add5             = add325;
				gamma0           = gamma032;
				gamma1           = gamma132;
				sigma0           = sigma032;
				sigma1           = sigma132;
				maj              = maj32;
				ch               = ch32;
				K                = Ksha2;

				break;
			case 'sha384':
			case 'sha512':
				numRounds        = 80;
				binaryStringMult = 2;
				Int              = Int64;
				add2             = add642;
				add4             = add644;
				add5             = add645;
				gamma0           = gamma064;
				gamma1           = gamma164;
				sigma0           = sigma064;
				sigma1           = sigma164;
				maj              = maj64;
				ch               = ch64;
				K                = Ksha512;

				break;
		}

		a = H[0];
		b = H[1];
		c = H[2];
		d = H[3];
		e = H[4];
		f = H[5];
		g = H[6];
		h = H[7];

		for(; t < numRounds; t++) {
			if(t < 16) {
				offset = t * binaryStringMult;
				int1   = (blockLength <= offset) ? 0 : block[offset];
				int2   = (blockLength <= offset + 1) ? 0 : block[offset + 1];
				W[t]   = new Int(int1, int2);
			} else {
				W[t] = add4(gamma1(W[t - 2]), W[t - 7], gamma0(W[t - 15]), W[t - 16]);
			}

			T1 = add5(h, sigma1(e), ch(e, f, g), K[t], W[t]);
			T2 = add2(sigma0(a), maj(a, b, c));
			h  = g;
			g  = f;
			f  = e;
			e  = add2(d, T1);
			d  = c;
			c  = b;
			b  = a;
			a  = add2(T1, T2);
		}

		H[0] = add2(a, H[0]);
		H[1] = add2(b, H[1]);
		H[2] = add2(c, H[2]);
		H[3] = add2(d, H[3]);
		H[4] = add2(e, H[4]);
		H[5] = add2(f, H[5]);
		H[6] = add2(g, H[6]);
		H[7] = add2(h, H[7]);

		return H;
	}

	function finalizeSHA2(remainder, remainderBinLen, processedBinLen, H, variant) {
		var remainderLength = remainder.length, i = 0, appendedMessageLength, offset, result, binaryStringInc;

		switch(variant) {
			case 'sha256':
				offset          = (((remainderBinLen + 65) >>> 9) << 4) + 15;
				binaryStringInc = 16;

				break;
			case 'sha384':
			case 'sha512':
				offset          = (((remainderBinLen + 129) >>> 10) << 5) + 31;
				binaryStringInc = 32;

				break;
		}

		while(remainderLength <= offset) {
			remainder.push(0);

			remainderLength++;
		}

		remainder[remainderBinLen >>> 5] |= 0x80 << (24 - remainderBinLen % 32);
		remainder[offset]                 = remainderBinLen + processedBinLen;
		appendedMessageLength             = remainderLength;

		for(; i < appendedMessageLength; i += binaryStringInc) {
			H = roundSHA2(remainder.slice(i, i + binaryStringInc), H, variant);
		}

		switch(variant) {
			case 'sha256':
				result = H;

				break;
			case 'sha384':
				result = [
					H[0].h, H[0].l,
					H[1].h, H[1].l,
					H[2].h, H[2].l,
					H[3].h, H[3].l,
					H[4].h, H[4].l,
					H[5].h, H[5].l
				];

				break;
			case 'sha512':
				result = [
					H[0].h, H[0].l,
					H[1].h, H[1].l,
					H[2].h, H[2].l,
					H[3].h, H[3].l,
					H[4].h, H[4].l,
					H[5].h, H[5].l,
					H[6].h, H[6].l,
					H[7].h, H[7].l
				];

				break;
		}

		return result;
	}

	function hash(variant, source) {
		var remainder = [], remainderLen = 0, i = 0, updateProcessedLen = 0, processedLen = 0, variantBlockSize, intermediateH, convertRet, chunkBinLen, chunk, chunkIntLen, variantBlockIntInc;

		switch(variant) {
			case 'sha256':
				variantBlockSize = 512;

				break;
			case 'sha384':
				variantBlockSize = 1024;

				break;
			case 'sha512':
				variantBlockSize = 1024;

				break;
			default:
				throw 'SHA_VARIANT_ERROR';
		}

		intermediateH      = getH(variant);
		convertRet         = str2binb(source, remainder, remainderLen);
		chunkBinLen        = convertRet['length'];
		chunk              = convertRet['value'];
		chunkIntLen        = chunkBinLen >>> 5;
		variantBlockIntInc = variantBlockSize >>> 5;

		for(; i < chunkIntLen; i += variantBlockIntInc) {
			if(updateProcessedLen + variantBlockSize <= chunkBinLen) {
				intermediateH       = roundSHA2(chunk.slice(i, i + variantBlockIntInc), intermediateH, variant);
				updateProcessedLen += variantBlockSize;
			}
		}

		processedLen += updateProcessedLen;
		remainder     = chunk.slice(updateProcessedLen >>> 5);
		remainderLen  = chunkBinLen % variantBlockSize;
		intermediateH = finalizeSHA2(remainder, remainderLen, processedLen, intermediateH, variant);

		return binb2b64(intermediateH);
	}

	function definition(path, isObject) {
		var settings;
		
		demand.on('postConfigure:' + path, onPostConfigure);
		
		function onPostConfigure(options) {
			if(isObject(options)) {
				settings = options;
			}
		}

		function isEnabled(path) {
			var key, match;

			for(key in settings) {
				if(key === path) {
					match = settings[key];

					break;
				}
			}

			return match || false;
		}

		demand
			.on('postRequest', function(loader) {
				var options;

				if(options = isEnabled(loader.path)) {
					if(hash(options.type, loader.source) !== options.hash) {
						loader.deferred.reject('/demand/plugin/sri');
					}
				}
			}
		);

		return true;
	}

	provide([ 'path', '/demand/validator/isObject' ], definition);
}());
#!/usr/bin/env node

const fs = require( 'fs' );
const path = require( 'path' );

const pre = './';
const isFolder = /^[^\.]+$/;
const isImage = /\.(jpg|jpeg|png|gif|svg|bmp|tif|tiff|ico)$/i;
// print process.argv
process.argv.forEach( function ( val, index, array ) {
	console.log( index + ': ' + val );
} );
console.log( `\n` );

const PATH = process.argv[2] ?? `./`;
const ROOT_DIR = ( PATH[0] == `.` ) ? PATH : `${pre}${PATH}`; //'./other';
const README_FILENAME = 'README.md';
const NB_IMAGES_PER_LINE = 4;

function generateReadme( dir = ROOT_DIR ) {
	let depth = ` `.repeat( ( dir.slice( 2 ).match( /\// ) || [] ).length );
	let nbImages = 0;
	let mdContent = '<table><tr>';
	fs.readdirSync( dir ).forEach( ( image ) => {
		if ( /*image !== README_FILENAME && */isImage.test( image ) ) {
			console.log( `${depth}${image}` );
			if ( !( nbImages % NB_IMAGES_PER_LINE ) ) {
				if ( nbImages > 0 ) {
					mdContent += `</tr>`;
				}
				mdContent += `<tr>`;
			}
			nbImages++;
			mdContent += `<td valign="bottom"><img src="./${image}" width="200"><br>${image}</td>`;
		} else if ( isFolder.test( image ) ) {
			if ( dir.slice( -1 ) === '/' ) { dir = dir.slice( 0, -1 ); }
			console.log( `\n${depth}FOLDER ${dir}/${image}` );
			generateReadme( `${dir}/${image}` );
		}
	} );
	mdContent += `</tr></table>`;
	fs.writeFileSync( path.join( dir, README_FILENAME ), mdContent );
}

generateReadme( PATH );
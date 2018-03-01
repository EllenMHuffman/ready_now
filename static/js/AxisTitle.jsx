'use strict';


// import React, {PureComponent} from 'react';
// import PropTypes from 'prop-types';

// class CustomAxisLabel extends PureComponent {
//   render() {
//     let width = 300
//     let height = 300
//     return (
//       <div>
//         <span transform={`translate(${width / 2}, ${height / 2})`}>
//         <label>TESTING LABEL NAME </label>
//         </span>
//       </div>
//     );
//   }
// }

// CustomAxisLabel.displayName = 'CustomAxisLabel';
// // CustomAxisLabel.requiresSVG = true;
// export default CustomAxisLabel;






// /////////////////////////////////////////////





// import PropTypes from 'prop-types';

// import {ORIENTATION} from 'utils/axis-utils';

// // Assuming that 16px = 1em
// const ADJUSTMENT_FOR_TEXT_SIZE = 16;
// const {LEFT, RIGHT, TOP, BOTTOM} = ORIENTATION;

// /**
//  * Compute transformations, keyed by orientation
//  * @param {number} width - width of axis
//  * @param {number} height - height of axis
//  * @returns {Object} Object of transformations, keyed by orientation
//  */
// const transformation = (width, height) => ({
//   [LEFT]: {
//     x: ADJUSTMENT_FOR_TEXT_SIZE,
//     y: 0,
//     rotation: -90,
//     textAnchor: 'end'
//   },
//   [RIGHT]: {
//     x: ADJUSTMENT_FOR_TEXT_SIZE * -0.5,
//     y: height,
//     rotation: -90,
//     textAnchor: 'start'
//   },
//   [TOP]: {
//     x: 0,
//     y: ADJUSTMENT_FOR_TEXT_SIZE,
//     rotation: 0,
//     textAnchor: 'start'
//   },
//   [BOTTOM]: {
//     x: width,
//     y: -6,
//     rotation: 0,
//     textAnchor: 'end'
//   }
// });

// const propTypes = {
//   width: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
//   orientation: PropTypes.oneOf([
//     LEFT, RIGHT, TOP, BOTTOM
//   ]).isRequired,
//   style: PropTypes.object,
//   title: PropTypes.string.isRequired
// };

// function AxisTitle({orientation, width, height, style, title}) {
//   const outerGroupTranslateX = orientation === LEFT ? width : 0;
//   const outerGroupTranslateY = orientation === TOP ? height : 0;
//   const outerGroupTransform = `translate(${outerGroupTranslateX}, ${outerGroupTranslateY})`;
//   const {x, y, rotation, textAnchor} = transformation(width, height)[orientation];
//   const innerGroupTransform = `translate(${x}, ${y}) rotate(${rotation})`;

//   return (
//     <g transform={outerGroupTransform} className="rv-xy-plot__axis__title">
//       <g style={{textAnchor, ...style}} transform={innerGroupTransform}>
//         <text style={style}>{title}</text>
//       </g>
//     </g>
//   );
// }

// AxisTitle.displayName = 'AxisTitle';
// AxisTitle.propTypes = propTypes;

// export default AxisTitle;

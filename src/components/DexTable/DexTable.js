import React, { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './DexTable.module.css';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const DexTable = (props) => {

  const [widths, setWidths] = useState(null);
  const [prevProps, setPrevProps] = useState(null);

  const refHeaderTable = useRef(null);
  const refBodyTable = useRef(null);

  if (prevProps !== props) {
    setPrevProps(props);
  }

  function updateWidths() {
    let firstRowCells = refBodyTable.current.querySelector('tr').childNodes;
    setWidths(Array.prototype.map.call(firstRowCells, cell => cell.clientWidth));
  }

  useLayoutEffect(updateWidths, []);

  useLayoutEffect(() => {
    refBodyTable.current.onscroll = () => {
      refHeaderTable.current.scrollLeft = refBodyTable.current.scrollLeft;
    }

    let bodyRef = refBodyTable.current;
    let headerRef = refHeaderTable.current;

    return () => {
      bodyRef.onscroll = undefined;
      bodyRef.scrollLeft = 0;
      headerRef.scrollLeft = 0;

      // console.log("cleaning up from prop change");

      updateWidths();
    }
  }, [prevProps]);

  useLayoutEffect(() => {
    window.addEventListener('resize', updateWidths);

    return () => {
      window.removeEventListener('resize', updateWidths);
    }
  });

  // console.log(widths);
  // console.log(props.minColumnWidths);

  return (
    <div className={styles.DexTable} data-testid="DexTable">
      <TableContainer ref={refHeaderTable} className={styles.HeaderTable}>
        <Table size="small" className={styles.Table} style={{ minWidth: props.tableWidth }}>
          <TableHead>
            <TableRow>
              {props.headerLabels.map((h, i) => {
                return (
                  <TableCell
                    key={h}
                    style={{ 
                      minWidth: (props.minColumnWidths ? props.minColumnWidths[i] : 'auto'),
                      width: (widths ? widths[i] : 'auto') 
                    }}
                    className={styles.TableHeadCell}
                  >{h}</TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <TableContainer ref={refBodyTable} className={styles.BodyTable}>
        <Table size="small" className={styles.Table} style={{ minWidth: props.tableWidth }}>
          <TableBody>
            {props.rowCellContents.map((row, i) => (
              <TableRow key={`row${i}`} className={(i % 2 === 0 ? styles.altRow : undefined)}>
                {row.map((cell, j) => (
                  <TableCell
                    key={`row${i}cell${j}`}
                    style={{ minWidth: props.minColumnWidths ? props.minColumnWidths[j] : undefined }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
};

DexTable.propTypes = {
  headerLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableWidth: PropTypes.string,
  rowCellContents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)).isRequired,
  minColumnWidths: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))
};

DexTable.defaultProps = {
  headerLabels: ["Header Content"],
  tableWidth: '50rem',
  rowCellContents: [[<span>Body Content</span>]],
  minColumnWidths: null
};

export default DexTable;

/*
 *  Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Scrollbars } from 'react-custom-scrollbars';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { VictoryPie, VictoryLegend, VictoryTooltip } from 'victory';
import sumBy from 'lodash/sumBy';
import CustomTable from './CustomTable';

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
    typography: {
        useNextVariants: true,
    },
});

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
    },
    typography: {
        useNextVariants: true,
    },
});

/**
 * React Component for Top Throttled Out Apis widget body
 * @param {any} props @inheritDoc
 * @returns {ReactElement} Render the Top Throttled Out Apis widget body
 */
export default function APIMTopThrottledApis(props) {
    const {
        themeName, height, limit, throttledData, legendData, handleChange, inProgress,
    } = props;
    const styles = {
        headingWrapper: {
            margin: 'auto',
            width: '95%',
        },
        paperWrapper: {
            height: '75%',
        },
        paper: {
            background: themeName === 'dark' ? '#969696' : '#E8E8E8',
            borderColor: themeName === 'dark' ? '#fff' : '#D8D8D8',
            width: '75%',
            padding: '4%',
            border: '1.5px solid',
            marginLeft: '5%',
        },
        formWrapper: {
            marginBottom: '5%',
        },
        form: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        formControl: {
            marginLeft: '5%',
            marginTop: '5%',
            minWidth: 120,
        },
        loadingIcon: {
            margin: 'auto',
            display: 'block',
        },
        loading: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height,
        },
    };

    return (
        <MuiThemeProvider
            theme={themeName === 'dark' ? darkTheme : lightTheme}
        >
            <Scrollbars style={{
                height,
                backgroundColor: themeName === 'dark' ? '#0e1e33' : '#fff',
            }}
            >
                <div style={{
                    backgroundColor: themeName === 'dark' ? '#0e1e33' : '#fff',
                    margin: '10px',
                    padding: '20px',
                }}
                >
                    <div style={styles.headingWrapper}>
                        <h3 style={{
                            borderBottom: themeName === 'dark' ? '1px solid #fff' : '1px solid #02212f',
                            paddingBottom: '10px',
                            margin: 'auto',
                            textAlign: 'left',
                            fontWeight: 'normal',
                            letterSpacing: 1.5,
                        }}
                        >
                            <FormattedMessage id='widget.heading' defaultMessage='TOP THROTTLED OUT APIS' />
                        </h3>
                    </div>
                    <div style={styles.formWrapper}>
                        <form style={styles.form} noValidate autoComplete='off'>
                            <TextField
                                id='limit-number'
                                label={<FormattedMessage id='limit' defaultMessage='Limit :' />}
                                value={limit}
                                onChange={handleChange}
                                type='number'
                                style={styles.formControl}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin='normal'
                            />
                        </form>
                    </div>
                    <div>
                        { inProgress ? (
                            <div style={styles.loading}>
                                <CircularProgress style={styles.loadingIcon} />
                            </div>
                        ) : (
                            <div>
                                { !throttledData || throttledData.length === 0 ? (
                                    <div style={styles.paperWrapper}>
                                        <Paper
                                            elevation={1}
                                            style={styles.paper}
                                        >
                                            <Typography variant='h5' component='h3'>
                                                <FormattedMessage
                                                    id='nodata.error.heading'
                                                    defaultMessage='No Data Available !'
                                                />
                                            </Typography>
                                            <Typography component='p'>
                                                <FormattedMessage
                                                    id='nodata.error.body'
                                                    defaultMessage='No data available for the selected options.'
                                                />
                                            </Typography>
                                        </Paper>
                                    </div>
                                ) : (
                                    <div>
                                        <svg viewBox='-50 0 1000 500'>
                                            <VictoryPie
                                                labelComponent={(
                                                    <VictoryTooltip
                                                        orientation='right'
                                                        pointerLength={0}
                                                        cornerRadius={2}
                                                        flyoutStyle={{
                                                            fill: '#000',
                                                            fillOpacity: '0.5',
                                                            strokeWidth: 1,
                                                        }}
                                                        style={{ fill: '#fff', fontSize: 25 }}
                                                    />
                                                )}
                                                width={500}
                                                height={500}
                                                standalone={false}
                                                padding={{
                                                    left: 50, bottom: 50, top: 50, right: 50,
                                                }}
                                                colorScale={['#385dbd', '#030d8a', '#59057b', '#ab0e86',
                                                    '#e01171', '#ffe2ff']}
                                                data={throttledData}
                                                x={d => d.apiname}
                                                y={d => d.throttledcount}
                                                labels={d => `${d.apiname} : ${((d.throttledcount
                                                    / (sumBy(throttledData, o => o.throttledcount))) * 100)
                                                    .toFixed(2)}%`}
                                            />
                                            <VictoryLegend
                                                standalone={false}
                                                colorScale={['#385dbd', '#030d8a', '#59057b', '#ab0e86',
                                                    '#e01171', '#ffe2ff']}
                                                x={450}
                                                y={20}
                                                gutter={20}
                                                rowGutter={{ top: 0, bottom: -10 }}
                                                style={{
                                                    labels: {
                                                        fill: '#9e9e9e',
                                                        fontSize: 25,
                                                    },
                                                }}
                                                data={legendData}
                                            />
                                        </svg>
                                        <CustomTable
                                            data={throttledData}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Scrollbars>
        </MuiThemeProvider>
    );
}

APIMTopThrottledApis.propTypes = {
    themeName: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    limit: PropTypes.string.isRequired,
    throttledData: PropTypes.instanceOf(Object).isRequired,
    legendData: PropTypes.instanceOf(Object).isRequired,
    handleChange: PropTypes.func.isRequired,
    inProgress: PropTypes.bool.isRequired,
};

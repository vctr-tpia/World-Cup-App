import React from 'react';
import { createClient } from '@supabase/supabase-js';

const TEAM_DATA = {"Algeria":{"elo":1756.4,"atk":1.482,"def":0.569,"color":"#1B7B3A","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"12.00\" height=\"16.00\" fill=\"#FFFFFF\"/><rect x=\"12.00\" y=\"0.00\" width=\"12.00\" height=\"16.00\" fill=\"#1B7B3A\"/><circle cx=\"12.60\" cy=\"8.00\" r=\"2.60\" fill=\"#D21126\"/><circle cx=\"13.60\" cy=\"8.00\" r=\"2.30\" fill=\"#FFFFFF\"/><polygon points=\"13.00,6.80 13.30,7.59 14.14,7.63 13.48,8.16 13.71,8.97 13.00,8.50 12.29,8.97 12.52,8.16 11.86,7.63 12.70,7.59\" fill=\"#D21126\"/>"},"Argentina":{"elo":1885.7,"atk":1.491,"def":0.354,"color":"#6CACE4","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.33\" fill=\"#74ACDF\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"5.33\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"10.67\" width=\"24.00\" height=\"5.33\" fill=\"#74ACDF\"/><circle cx=\"12.00\" cy=\"8.00\" r=\"1.90\" fill=\"#F6B40E\"/><circle cx=\"12.00\" cy=\"8.00\" r=\"1.90\" fill=\"none\"/>"},"Australia":{"elo":1752.4,"atk":1.311,"def":0.507,"color":"#FFCD00","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#00247D\"/><rect x=\"0.00\" y=\"0.00\" width=\"11.00\" height=\"7.00\" fill=\"#00247D\"/><polygon points=\"2.40,1.10 2.52,1.43 2.88,1.45 2.60,1.66 2.69,2.00 2.40,1.81 2.11,2.00 2.20,1.66 1.92,1.45 2.28,1.43\" fill=\"#FFFFFF\"/><polygon points=\"2.40,4.50 2.52,4.83 2.88,4.85 2.60,5.06 2.69,5.40 2.40,5.21 2.11,5.40 2.20,5.06 1.92,4.85 2.28,4.83\" fill=\"#FFFFFF\"/><polygon points=\"5.50,2.70 5.65,3.10 6.07,3.11 5.74,3.38 5.85,3.79 5.50,3.55 5.15,3.79 5.26,3.38 4.93,3.11 5.35,3.10\" fill=\"#FFFFFF\"/><polygon points=\"17.00,2.90 17.32,3.76 18.24,3.80 17.52,4.37 17.76,5.25 17.00,4.75 16.24,5.25 16.48,4.37 15.76,3.80 16.68,3.76\" fill=\"#FFFFFF\"/><polygon points=\"20.00,9.00 20.25,9.66 20.95,9.69 20.40,10.13 20.59,10.81 20.00,10.42 19.41,10.81 19.60,10.13 19.05,9.69 19.75,9.66\" fill=\"#FFFFFF\"/><polygon points=\"15.00,11.60 15.22,12.19 15.86,12.22 15.36,12.62 15.53,13.23 15.00,12.88 14.47,13.23 14.64,12.62 14.14,12.22 14.78,12.19\" fill=\"#FFFFFF\"/><polygon points=\"20.50,12.80 20.75,13.46 21.45,13.49 20.90,13.93 21.09,14.61 20.50,14.22 19.91,14.61 20.10,13.93 19.55,13.49 20.25,13.46\" fill=\"#FFFFFF\"/>"},"Austria":{"elo":1701.1,"atk":1.492,"def":0.68,"color":"#ED2939","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.33\" fill=\"#ED2939\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"5.33\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"10.67\" width=\"24.00\" height=\"5.33\" fill=\"#ED2939\"/>"},"Belgium":{"elo":1733.6,"atk":1.597,"def":0.644,"color":"#ED2939","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#000000\"/><rect x=\"8.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#FAE042\"/><rect x=\"16.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#ED2939\"/>"},"Bosnia and Herzegovina":{"elo":1473.4,"atk":0.881,"def":1.166,"color":"#1E3A8A","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#002395\"/><polygon points=\"0,0 9,0 0,16\" fill=\"#FECB00\"/><polygon points=\"12.00,1.75 12.19,2.25 12.71,2.27 12.30,2.60 12.44,3.11 12.00,2.81 11.56,3.11 11.70,2.60 11.29,2.27 11.81,2.25\" fill=\"#FFFFFF\"/><polygon points=\"13.70,3.45 13.89,3.95 14.41,3.97 14.00,4.30 14.14,4.81 13.70,4.52 13.26,4.81 13.40,4.30 12.99,3.97 13.51,3.95\" fill=\"#FFFFFF\"/><polygon points=\"15.40,5.15 15.59,5.65 16.11,5.67 15.70,6.00 15.84,6.51 15.40,6.22 14.96,6.51 15.10,6.00 14.69,5.67 15.21,5.65\" fill=\"#FFFFFF\"/><polygon points=\"17.10,6.85 17.29,7.35 17.81,7.37 17.40,7.70 17.54,8.21 17.10,7.92 16.66,8.21 16.80,7.70 16.39,7.37 16.91,7.35\" fill=\"#FFFFFF\"/><polygon points=\"18.80,8.55 18.99,9.05 19.51,9.07 19.10,9.40 19.24,9.91 18.80,9.62 18.36,9.91 18.50,9.40 18.09,9.07 18.61,9.05\" fill=\"#FFFFFF\"/><polygon points=\"20.50,10.25 20.69,10.75 21.21,10.77 20.80,11.10 20.94,11.61 20.50,11.31 20.06,11.61 20.20,11.10 19.79,10.77 20.31,10.75\" fill=\"#FFFFFF\"/><polygon points=\"22.20,11.95 22.39,12.45 22.91,12.47 22.50,12.80 22.64,13.31 22.20,13.01 21.76,13.31 21.90,12.80 21.49,12.47 22.01,12.45\" fill=\"#FFFFFF\"/>"},"Brazil":{"elo":1783.6,"atk":1.291,"def":0.6,"color":"#FFD700","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#009C3B\"/><polygon points=\"12,1.3 22.5,8 12,14.7 1.5,8\" fill=\"#FFDF00\"/><circle cx=\"12.00\" cy=\"8.00\" r=\"3.30\" fill=\"#002776\"/>"},"Canada":{"elo":1721.0,"atk":1.348,"def":0.632,"color":"#FF0000","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#FF0000\"/><rect x=\"8.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#FFFFFF\"/><rect x=\"16.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#FF0000\"/><polygon points=\"12.00,5.00 12.74,6.98 14.85,7.07 13.20,8.39 13.76,10.43 12.00,9.26 10.24,10.43 10.80,8.39 9.15,7.07 11.26,6.98\" fill=\"#FF0000\"/>"},"Cape Verde":{"elo":1603.0,"atk":0.875,"def":0.672,"color":"#003893","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#003893\"/><rect x=\"0.00\" y=\"8.70\" width=\"24.00\" height=\"1.80\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"10.50\" width=\"24.00\" height=\"0.90\" fill=\"#CF2027\"/><polygon points=\"7.50,4.30 7.62,4.63 7.98,4.65 7.70,4.86 7.79,5.20 7.50,5.01 7.21,5.20 7.30,4.86 7.02,4.65 7.38,4.63\" fill=\"#FCD116\"/><polygon points=\"9.20,4.30 9.32,4.63 9.68,4.65 9.40,4.86 9.49,5.20 9.20,5.01 8.91,5.20 9.00,4.86 8.72,4.65 9.08,4.63\" fill=\"#FCD116\"/><polygon points=\"10.90,4.30 11.02,4.63 11.38,4.65 11.10,4.86 11.19,5.20 10.90,5.01 10.61,5.20 10.70,4.86 10.42,4.65 10.78,4.63\" fill=\"#FCD116\"/><polygon points=\"12.60,4.30 12.72,4.63 13.08,4.65 12.80,4.86 12.89,5.20 12.60,5.01 12.31,5.20 12.40,4.86 12.12,4.65 12.48,4.63\" fill=\"#FCD116\"/><polygon points=\"14.30,4.30 14.42,4.63 14.78,4.65 14.50,4.86 14.59,5.20 14.30,5.01 14.01,5.20 14.10,4.86 13.82,4.65 14.18,4.63\" fill=\"#FCD116\"/><polygon points=\"16.00,4.30 16.12,4.63 16.48,4.65 16.20,4.86 16.29,5.20 16.00,5.01 15.71,5.20 15.80,4.86 15.52,4.65 15.88,4.63\" fill=\"#FCD116\"/>"},"Colombia":{"elo":1778.6,"atk":1.291,"def":0.643,"color":"#FCD116","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"4.00\" fill=\"#FCD116\"/><rect x=\"0.00\" y=\"4.00\" width=\"24.00\" height=\"4.00\" fill=\"#FCD116\"/><rect x=\"0.00\" y=\"8.00\" width=\"24.00\" height=\"4.00\" fill=\"#003893\"/><rect x=\"0.00\" y=\"12.00\" width=\"24.00\" height=\"4.00\" fill=\"#CE1126\"/>"},"Croatia":{"elo":1694.7,"atk":1.313,"def":0.87,"color":"#FF0000","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.33\" fill=\"#FF0000\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"5.33\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"10.67\" width=\"24.00\" height=\"5.33\" fill=\"#171796\"/>"},"Curaçao":{"elo":1554.6,"atk":1.305,"def":1.075,"color":"#002B7F","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#002B7F\"/><rect x=\"0.00\" y=\"11.00\" width=\"24.00\" height=\"2.00\" fill=\"#FCD116\"/><polygon points=\"6.00,3.90 6.27,4.63 7.05,4.66 6.44,5.14 6.65,5.89 6.00,5.46 5.35,5.89 5.56,5.14 4.95,4.66 5.73,4.63\" fill=\"#FFFFFF\"/><polygon points=\"7.30,3.60 7.45,4.00 7.87,4.01 7.54,4.28 7.65,4.69 7.30,4.45 6.95,4.69 7.06,4.28 6.73,4.01 7.15,4.00\" fill=\"#FFFFFF\"/>"},"Czech Republic":{"elo":1596.0,"atk":1.237,"def":0.888,"color":"#D7141A","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"8.00\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"8.00\" width=\"24.00\" height=\"8.00\" fill=\"#D7141A\"/><polygon points=\"0,0 10,8 0,16\" fill=\"#11457E\"/>"},"DR Congo":{"elo":1652.8,"atk":0.861,"def":0.489,"color":"#007FFF","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#007FFF\"/><polygon points=\"0,16 17,16 0,3\" fill=\"#F7D618\"/><polygon points=\"0,16 13.5,16 0,5\" fill=\"#CE1021\"/><polygon points=\"18.00,3.50 18.37,4.49 19.43,4.54 18.60,5.19 18.88,6.21 18.00,5.63 17.12,6.21 17.40,5.19 16.57,4.54 17.63,4.49\" fill=\"#F7D618\"/>"},"Ecuador":{"elo":1691.8,"atk":0.751,"def":0.516,"color":"#FFD100","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"4.00\" fill=\"#FFD100\"/><rect x=\"0.00\" y=\"4.00\" width=\"24.00\" height=\"4.00\" fill=\"#FFD100\"/><rect x=\"0.00\" y=\"8.00\" width=\"24.00\" height=\"4.00\" fill=\"#003893\"/><rect x=\"0.00\" y=\"12.00\" width=\"24.00\" height=\"4.00\" fill=\"#ED1C24\"/><circle cx=\"12.00\" cy=\"7.00\" r=\"1.80\" fill=\"#FFD100\"/>"},"Egypt":{"elo":1705.1,"atk":1.04,"def":0.523,"color":"#C8102E","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.33\" fill=\"#CE1126\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"5.33\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"10.67\" width=\"24.00\" height=\"5.33\" fill=\"#000000\"/><polygon points=\"12,5.8 13.6,7.5 12,9.2 10.4,7.5\" fill=\"#C09300\"/><circle cx=\"12.00\" cy=\"7.00\" r=\"0.70\" fill=\"#C09300\"/>"},"England":{"elo":1828.0,"atk":1.623,"def":0.471,"color":"#CE1124","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#FFFFFF\"/><rect x=\"10.00\" y=\"0.00\" width=\"4.00\" height=\"16.00\" fill=\"#CE1124\"/><rect x=\"0.00\" y=\"6.00\" width=\"24.00\" height=\"4.00\" fill=\"#CE1124\"/>"},"France":{"elo":1841.9,"atk":1.553,"def":0.665,"color":"#0055A4","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#0055A4\"/><rect x=\"8.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#FFFFFF\"/><rect x=\"16.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#EF4135\"/>"},"Germany":{"elo":1760.3,"atk":1.844,"def":0.798,"color":"#1A1A1A","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.33\" fill=\"#000000\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"5.33\" fill=\"#DD0000\"/><rect x=\"0.00\" y=\"10.67\" width=\"24.00\" height=\"5.33\" fill=\"#FFCE00\"/>"},"Ghana":{"elo":1576.3,"atk":0.981,"def":0.812,"color":"#006B3F","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.33\" fill=\"#CE1126\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"5.33\" fill=\"#FCD116\"/><rect x=\"0.00\" y=\"10.67\" width=\"24.00\" height=\"5.33\" fill=\"#006B3F\"/><polygon points=\"12.00,6.40 12.39,7.46 13.52,7.51 12.64,8.21 12.94,9.29 12.00,8.67 11.06,9.29 11.36,8.21 10.48,7.51 11.61,7.46\" fill=\"#000000\"/>"},"Haiti":{"elo":1639.2,"atk":1.575,"def":0.847,"color":"#00209F","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"8.00\" fill=\"#00209F\"/><rect x=\"0.00\" y=\"8.00\" width=\"24.00\" height=\"8.00\" fill=\"#D21034\"/><rect x=\"9.50\" y=\"5.00\" width=\"5.00\" height=\"6.00\" fill=\"#FFFFFF\"/>"},"Iran":{"elo":1758.4,"atk":1.473,"def":0.627,"color":"#DA0000","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.33\" fill=\"#239F40\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"5.33\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"10.67\" width=\"24.00\" height=\"5.33\" fill=\"#DA0000\"/><circle cx=\"12.00\" cy=\"8.00\" r=\"1.50\" fill=\"#DA0000\"/>"},"Iraq":{"elo":1623.4,"atk":0.935,"def":0.774,"color":"#CE1126","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.33\" fill=\"#CE1126\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"5.33\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"10.67\" width=\"24.00\" height=\"5.33\" fill=\"#000000\"/><polygon points=\"10.00,7.10 10.22,7.69 10.86,7.72 10.36,8.12 10.53,8.73 10.00,8.38 9.47,8.73 9.64,8.12 9.14,7.72 9.78,7.69\" fill=\"#007A3D\"/><polygon points=\"12.00,7.10 12.22,7.69 12.86,7.72 12.36,8.12 12.53,8.73 12.00,8.38 11.47,8.73 11.64,8.12 11.14,7.72 11.78,7.69\" fill=\"#007A3D\"/><polygon points=\"14.00,7.10 14.22,7.69 14.86,7.72 14.36,8.12 14.53,8.73 14.00,8.38 13.47,8.73 13.64,8.12 13.14,7.72 13.78,7.69\" fill=\"#007A3D\"/>"},"Ivory Coast":{"elo":1735.0,"atk":1.276,"def":0.484,"color":"#F77F00","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#FF8200\"/><rect x=\"8.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#FFFFFF\"/><rect x=\"16.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#009E60\"/>"},"Japan":{"elo":1804.1,"atk":1.772,"def":0.548,"color":"#0B3D91","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#FFFFFF\"/><circle cx=\"12.00\" cy=\"8.00\" r=\"3.00\" fill=\"#BC002D\"/>"},"Jordan":{"elo":1630.6,"atk":1.172,"def":0.901,"color":"#CE1126","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.33\" fill=\"#000000\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"5.33\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"10.67\" width=\"24.00\" height=\"5.33\" fill=\"#007A3D\"/><polygon points=\"0,0 11,8 0,16\" fill=\"#CE1126\"/><polygon points=\"4.20,7.00 4.45,7.66 5.15,7.69 4.60,8.13 4.79,8.81 4.20,8.42 3.61,8.81 3.80,8.13 3.25,7.69 3.95,7.66\" fill=\"#FFFFFF\"/>"},"Mexico":{"elo":1784.4,"atk":1.091,"def":0.538,"color":"#006847","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#006847\"/><rect x=\"8.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#FFFFFF\"/><rect x=\"16.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#CE1126\"/><circle cx=\"12.00\" cy=\"8.00\" r=\"1.30\" fill=\"#8B5A2B\"/>"},"Morocco":{"elo":1824.0,"atk":1.436,"def":0.317,"color":"#C1272D","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#C1272D\"/><polygon points=\"12.00,5.60 12.59,7.18 14.28,7.26 12.96,8.31 13.41,9.94 12.00,9.01 10.59,9.94 11.04,8.31 9.72,7.26 11.41,7.18\" fill=\"#006233\"/>"},"Netherlands":{"elo":1762.0,"atk":1.681,"def":0.746,"color":"#FF6C00","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.33\" fill=\"#AE1C28\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"5.33\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"10.67\" width=\"24.00\" height=\"5.33\" fill=\"#21468B\"/>"},"New Zealand":{"elo":1603.1,"atk":1.499,"def":0.813,"color":"#1A1A1A","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#00247D\"/><rect x=\"0.00\" y=\"0.00\" width=\"10.00\" height=\"7.00\" fill=\"#00247D\"/><polygon points=\"15.00,3.00 15.25,3.66 15.95,3.69 15.40,4.13 15.59,4.81 15.00,4.42 14.41,4.81 14.60,4.13 14.05,3.69 14.75,3.66\" fill=\"#CE1126\"/><polygon points=\"19.00,2.30 19.17,2.76 19.67,2.78 19.28,3.09 19.41,3.57 19.00,3.29 18.59,3.57 18.72,3.09 18.33,2.78 18.83,2.76\" fill=\"#CE1126\"/><polygon points=\"18.00,8.10 18.22,8.69 18.86,8.72 18.36,9.12 18.53,9.73 18.00,9.38 17.47,9.73 17.64,9.12 17.14,8.72 17.78,8.69\" fill=\"#CE1126\"/><polygon points=\"15.00,11.20 15.20,11.73 15.76,11.75 15.32,12.10 15.47,12.65 15.00,12.34 14.53,12.65 14.68,12.10 14.24,11.75 14.80,11.73\" fill=\"#CE1126\"/>"},"Norway":{"elo":1734.0,"atk":1.9,"def":0.691,"color":"#BA0C2F","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#EF2B2D\"/><rect x=\"7.40\" y=\"0.00\" width=\"4.00\" height=\"16.00\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"6.00\" width=\"24.00\" height=\"4.00\" fill=\"#FFFFFF\"/><rect x=\"8.40\" y=\"0.00\" width=\"2.00\" height=\"16.00\" fill=\"#002868\"/><rect x=\"0.00\" y=\"7.00\" width=\"24.00\" height=\"2.00\" fill=\"#002868\"/>"},"Panama":{"elo":1669.9,"atk":1.162,"def":0.892,"color":"#DA121A","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"12.00\" height=\"8.00\" fill=\"#FFFFFF\"/><rect x=\"12.00\" y=\"0.00\" width=\"12.00\" height=\"8.00\" fill=\"#DA121A\"/><rect x=\"0.00\" y=\"8.00\" width=\"12.00\" height=\"8.00\" fill=\"#0038A8\"/><rect x=\"12.00\" y=\"8.00\" width=\"12.00\" height=\"8.00\" fill=\"#FFFFFF\"/><polygon points=\"6.00,3.00 6.25,3.66 6.95,3.69 6.40,4.13 6.59,4.81 6.00,4.42 5.41,4.81 5.60,4.13 5.05,3.69 5.75,3.66\" fill=\"#0038A8\"/><polygon points=\"18.00,11.00 18.25,11.66 18.95,11.69 18.40,12.13 18.59,12.81 18.00,12.42 17.41,12.81 17.60,12.13 17.05,11.69 17.75,11.66\" fill=\"#DA121A\"/>"},"Paraguay":{"elo":1564.7,"atk":0.714,"def":0.923,"color":"#D52B1E","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.33\" fill=\"#D52B1E\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"5.33\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"10.67\" width=\"24.00\" height=\"5.33\" fill=\"#0038A8\"/><circle cx=\"12.00\" cy=\"8.00\" r=\"1.30\" fill=\"#FFFFFF\"/>"},"Portugal":{"elo":1775.9,"atk":1.65,"def":0.636,"color":"#006600","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"4.80\" height=\"16.00\" fill=\"#006600\"/><rect x=\"4.80\" y=\"0.00\" width=\"4.80\" height=\"16.00\" fill=\"#006600\"/><rect x=\"9.60\" y=\"0.00\" width=\"4.80\" height=\"16.00\" fill=\"#FF0000\"/><rect x=\"14.40\" y=\"0.00\" width=\"4.80\" height=\"16.00\" fill=\"#FF0000\"/><rect x=\"19.20\" y=\"0.00\" width=\"4.80\" height=\"16.00\" fill=\"#FF0000\"/><circle cx=\"9.60\" cy=\"8.00\" r=\"2.10\" fill=\"#FFCC00\"/>"},"Qatar":{"elo":1529.9,"atk":1.005,"def":1.124,"color":"#8D1B3D","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#FFFFFF\"/><polygon points=\"7.5,0 24,0 24,16 7.5,16 10.2,14.2 7.9,12.4 10.2,10.6 7.9,8.8 10.2,7 7.9,5.2 10.2,3.4 7.9,1.6\" fill=\"#8D1B3D\"/>"},"Saudi Arabia":{"elo":1612.4,"atk":0.83,"def":0.715,"color":"#006C35","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#006C35\"/><rect x=\"2.50\" y=\"6.00\" width=\"19.00\" height=\"2.60\" fill=\"#FFFFFF\"/><rect x=\"2.50\" y=\"11.20\" width=\"15.00\" height=\"1.00\" fill=\"#FFFFFF\"/><rect x=\"2.50\" y=\"11.20\" width=\"1.00\" height=\"1.00\" fill=\"#FFFFFF\"/>"},"Scotland":{"elo":1618.5,"atk":1.097,"def":0.892,"color":"#0065BD","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#0065BD\"/><polygon points=\"0,0 4.20,0 24,11.80 24,16\" fill=\"#FFFFFF\"/><polygon points=\"24,0 19.80,0 0,11.80 0,16\" fill=\"#FFFFFF\"/>"},"Senegal":{"elo":1757.1,"atk":1.316,"def":0.54,"color":"#00853F","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#00853F\"/><rect x=\"8.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#FCD116\"/><rect x=\"16.00\" y=\"0.00\" width=\"8.00\" height=\"16.00\" fill=\"#E31B23\"/><polygon points=\"12.00,6.50 12.37,7.49 13.43,7.54 12.60,8.19 12.88,9.21 12.00,8.63 11.12,9.21 11.40,8.19 10.57,7.54 11.63,7.49\" fill=\"#00853F\"/>"},"South Africa":{"elo":1606.0,"atk":0.975,"def":0.651,"color":"#007749","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#FFFFFF\"/><polygon points=\"0,0 9,8 0,16\" fill=\"#000000\"/><polygon points=\"0,1.4 8.2,8 0,14.6\" fill=\"#FFB612\"/><rect x=\"0.00\" y=\"2.80\" width=\"24.00\" height=\"2.40\" fill=\"#DE3831\"/><rect x=\"0.00\" y=\"10.80\" width=\"24.00\" height=\"2.40\" fill=\"#002395\"/><rect x=\"0.00\" y=\"5.20\" width=\"24.00\" height=\"5.60\" fill=\"#007749\"/>"},"South Korea":{"elo":1730.6,"atk":1.311,"def":0.677,"color":"#CD2E3A","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#FFFFFF\"/><circle cx=\"12.00\" cy=\"8.00\" r=\"2.60\" fill=\"#CD2E3A\"/><path d=\"M 12 5.4 A 1.3 1.3 0 0 1 12 8 A 1.3 1.3 0 0 0 12 10.6 A 2.6 2.6 0 0 0 12 5.4 Z\" fill=\"#0047A0\"/>"},"Spain":{"elo":1873.0,"atk":1.701,"def":0.566,"color":"#C60B1E","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"3.20\" fill=\"#AA151B\"/><rect x=\"0.00\" y=\"3.20\" width=\"24.00\" height=\"3.20\" fill=\"#FCD116\"/><rect x=\"0.00\" y=\"6.40\" width=\"24.00\" height=\"3.20\" fill=\"#FCD116\"/><rect x=\"0.00\" y=\"9.60\" width=\"24.00\" height=\"3.20\" fill=\"#FCD116\"/><rect x=\"0.00\" y=\"12.80\" width=\"24.00\" height=\"3.20\" fill=\"#AA151B\"/>"},"Sweden":{"elo":1622.5,"atk":1.392,"def":1.006,"color":"#FFCC00","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#006AA7\"/><rect x=\"8.20\" y=\"0.00\" width=\"3.40\" height=\"16.00\" fill=\"#FECC02\"/><rect x=\"0.00\" y=\"6.30\" width=\"24.00\" height=\"3.40\" fill=\"#FECC02\"/>"},"Switzerland":{"elo":1708.8,"atk":1.355,"def":0.831,"color":"#FF0000","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#FF0000\"/><rect x=\"9.60\" y=\"4.00\" width=\"4.80\" height=\"8.00\" fill=\"#FFFFFF\"/><rect x=\"7.20\" y=\"6.40\" width=\"9.60\" height=\"3.20\" fill=\"#FFFFFF\"/>"},"Tunisia":{"elo":1622.2,"atk":1.02,"def":0.696,"color":"#E70013","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#E70013\"/><circle cx=\"12.00\" cy=\"8.00\" r=\"3.20\" fill=\"#FFFFFF\"/><circle cx=\"12.90\" cy=\"8.00\" r=\"2.50\" fill=\"#E70013\"/><polygon points=\"11.60,6.90 11.87,7.63 12.65,7.66 12.04,8.14 12.25,8.89 11.60,8.46 10.95,8.89 11.16,8.14 10.55,7.66 11.33,7.63\" fill=\"#FFFFFF\"/>"},"Turkey":{"elo":1670.5,"atk":1.328,"def":0.955,"color":"#E30A17","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#E30A17\"/><circle cx=\"10.00\" cy=\"8.00\" r=\"2.90\" fill=\"#FFFFFF\"/><circle cx=\"10.90\" cy=\"8.00\" r=\"2.40\" fill=\"#E30A17\"/><polygon points=\"14.50,6.90 14.77,7.63 15.55,7.66 14.94,8.14 15.15,8.89 14.50,8.46 13.85,8.89 14.06,8.14 13.45,7.66 14.23,7.63\" fill=\"#FFFFFF\"/>"},"United States":{"elo":1692.0,"atk":1.428,"def":0.753,"color":"#3C3B6E","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"2.29\" fill=\"#B22234\"/><rect x=\"0.00\" y=\"2.29\" width=\"24.00\" height=\"2.29\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"4.57\" width=\"24.00\" height=\"2.29\" fill=\"#B22234\"/><rect x=\"0.00\" y=\"6.86\" width=\"24.00\" height=\"2.29\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"9.14\" width=\"24.00\" height=\"2.29\" fill=\"#B22234\"/><rect x=\"0.00\" y=\"11.43\" width=\"24.00\" height=\"2.29\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"13.71\" width=\"24.00\" height=\"2.29\" fill=\"#B22234\"/><rect x=\"0.00\" y=\"0.00\" width=\"10.00\" height=\"4.31\" fill=\"#3C3B6E\"/>"},"Uruguay":{"elo":1693.1,"atk":0.904,"def":0.558,"color":"#6CACE4","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"16.00\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"1.78\" width=\"24.00\" height=\"1.78\" fill=\"#0038A8\"/><rect x=\"0.00\" y=\"5.33\" width=\"24.00\" height=\"1.78\" fill=\"#0038A8\"/><rect x=\"0.00\" y=\"8.89\" width=\"24.00\" height=\"1.78\" fill=\"#0038A8\"/><rect x=\"0.00\" y=\"12.44\" width=\"24.00\" height=\"1.78\" fill=\"#0038A8\"/><rect x=\"0.00\" y=\"0.00\" width=\"9.00\" height=\"8.90\" fill=\"#FFFFFF\"/><circle cx=\"4.50\" cy=\"4.40\" r=\"1.10\" fill=\"#FCD116\"/><polygon points=\"5.60,4.95 7.10,4.40 5.60,3.85\" fill=\"#FCD116\"/><polygon points=\"4.89,5.57 6.34,6.24 5.67,4.79\" fill=\"#FCD116\"/><polygon points=\"3.95,5.50 4.50,7.00 5.05,5.50\" fill=\"#FCD116\"/><polygon points=\"3.33,4.79 2.66,6.24 4.11,5.57\" fill=\"#FCD116\"/><polygon points=\"3.40,3.85 1.90,4.40 3.40,4.95\" fill=\"#FCD116\"/><polygon points=\"4.11,3.23 2.66,2.56 3.33,4.01\" fill=\"#FCD116\"/><polygon points=\"5.05,3.30 4.50,1.80 3.95,3.30\" fill=\"#FCD116\"/><polygon points=\"5.67,4.01 6.34,2.56 4.89,3.23\" fill=\"#FCD116\"/>"},"Uzbekistan":{"elo":1674.3,"atk":1.11,"def":0.655,"color":"#0099B5","flag":"<rect x=\"0.00\" y=\"0.00\" width=\"24.00\" height=\"5.00\" fill=\"#0099B5\"/><rect x=\"0.00\" y=\"5.00\" width=\"24.00\" height=\"1.00\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"6.00\" width=\"24.00\" height=\"1.00\" fill=\"#CE1126\"/><rect x=\"0.00\" y=\"7.00\" width=\"24.00\" height=\"1.00\" fill=\"#FFFFFF\"/><rect x=\"0.00\" y=\"8.00\" width=\"24.00\" height=\"8.00\" fill=\"#1EB53A\"/><circle cx=\"4.20\" cy=\"2.50\" r=\"1.50\" fill=\"#FFFFFF\"/>"}};

const WC_GROUPS = [["Mexico", "South Africa", "South Korea", "Czech Republic"], ["Canada", "Qatar", "Switzerland", "Bosnia and Herzegovina"], ["Brazil", "Morocco", "Haiti", "Scotland"], ["United States", "Paraguay", "Australia", "Turkey"], ["Germany", "Curaçao", "Ivory Coast", "Ecuador"], ["Netherlands", "Japan", "Tunisia", "Sweden"], ["Belgium", "Egypt", "Iran", "New Zealand"], ["Spain", "Cape Verde", "Uruguay", "Saudi Arabia"], ["France", "Senegal", "Norway", "Iraq"], ["Argentina", "Algeria", "Austria", "Jordan"], ["Portugal", "DR Congo", "Uzbekistan", "Colombia"], ["England", "Croatia", "Ghana", "Panama"]];

const WC_GROUP_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const WC_FIXTURES = [{"home": "Mexico", "away": "South Africa", "hs": 2, "aw": 0, "neutral": false, "date": "2026-06-11"}, {"home": "South Korea", "away": "Czech Republic", "hs": 2, "aw": 1, "neutral": true, "date": "2026-06-11"}, {"home": "Canada", "away": "Bosnia and Herzegovina", "hs": 1, "aw": 1, "neutral": false, "date": "2026-06-12"}, {"home": "United States", "away": "Paraguay", "hs": 4, "aw": 1, "neutral": false, "date": "2026-06-12"}, {"home": "Qatar", "away": "Switzerland", "hs": 1, "aw": 1, "neutral": true, "date": "2026-06-13"}, {"home": "Brazil", "away": "Morocco", "hs": 1, "aw": 1, "neutral": true, "date": "2026-06-13"}, {"home": "Haiti", "away": "Scotland", "hs": 0, "aw": 1, "neutral": true, "date": "2026-06-13"}, {"home": "Australia", "away": "Turkey", "hs": 2, "aw": 0, "neutral": true, "date": "2026-06-13"}, {"home": "Germany", "away": "Curaçao", "hs": 7, "aw": 1, "neutral": true, "date": "2026-06-14"}, {"home": "Ivory Coast", "away": "Ecuador", "hs": 1, "aw": 0, "neutral": true, "date": "2026-06-14"}, {"home": "Netherlands", "away": "Japan", "hs": 2, "aw": 2, "neutral": true, "date": "2026-06-14"}, {"home": "Sweden", "away": "Tunisia", "hs": 5, "aw": 1, "neutral": true, "date": "2026-06-14"}, {"home": "Belgium", "away": "Egypt", "hs": 1, "aw": 1, "neutral": true, "date": "2026-06-15"}, {"home": "Iran", "away": "New Zealand", "hs": 2, "aw": 2, "neutral": true, "date": "2026-06-15"}, {"home": "Spain", "away": "Cape Verde", "hs": 0, "aw": 0, "neutral": true, "date": "2026-06-15"}, {"home": "Saudi Arabia", "away": "Uruguay", "hs": 1, "aw": 1, "neutral": true, "date": "2026-06-15"}, {"home": "France", "away": "Senegal", "hs": 3, "aw": 1, "neutral": true, "date": "2026-06-16"}, {"home": "Iraq", "away": "Norway", "hs": 1, "aw": 4, "neutral": true, "date": "2026-06-16"}, {"home": "Argentina", "away": "Algeria", "hs": 3, "aw": 0, "neutral": true, "date": "2026-06-16"}, {"home": "Austria", "away": "Jordan", "hs": 3, "aw": 1, "neutral": true, "date": "2026-06-16"}, {"home": "Portugal", "away": "DR Congo", "hs": 1, "aw": 1, "neutral": true, "date": "2026-06-17"}, {"home": "Uzbekistan", "away": "Colombia", "hs": 1, "aw": 3, "neutral": true, "date": "2026-06-17"}, {"home": "England", "away": "Croatia", "hs": 4, "aw": 2, "neutral": true, "date": "2026-06-17"}, {"home": "Ghana", "away": "Panama", "hs": 1, "aw": 0, "neutral": true, "date": "2026-06-17"}, {"home": "Czech Republic", "away": "South Africa", "hs": 1, "aw": 1, "neutral": true, "date": "2026-06-18"}, {"home": "Mexico", "away": "South Korea", "hs": 1, "aw": 0, "neutral": false, "date": "2026-06-18"}, {"home": "Switzerland", "away": "Bosnia and Herzegovina", "hs": 4, "aw": 1, "neutral": true, "date": "2026-06-18"}, {"home": "Canada", "away": "Qatar", "hs": 6, "aw": 0, "neutral": false, "date": "2026-06-18"}, {"home": "Scotland", "away": "Morocco", "hs": null, "aw": null, "neutral": true, "date": "2026-06-19"}, {"home": "Brazil", "away": "Haiti", "hs": null, "aw": null, "neutral": true, "date": "2026-06-19"}, {"home": "United States", "away": "Australia", "hs": null, "aw": null, "neutral": false, "date": "2026-06-19"}, {"home": "Turkey", "away": "Paraguay", "hs": null, "aw": null, "neutral": true, "date": "2026-06-19"}, {"home": "Germany", "away": "Ivory Coast", "hs": null, "aw": null, "neutral": true, "date": "2026-06-20"}, {"home": "Ecuador", "away": "Curaçao", "hs": null, "aw": null, "neutral": true, "date": "2026-06-20"}, {"home": "Netherlands", "away": "Sweden", "hs": null, "aw": null, "neutral": true, "date": "2026-06-20"}, {"home": "Tunisia", "away": "Japan", "hs": null, "aw": null, "neutral": true, "date": "2026-06-20"}, {"home": "Belgium", "away": "Iran", "hs": null, "aw": null, "neutral": true, "date": "2026-06-21"}, {"home": "New Zealand", "away": "Egypt", "hs": null, "aw": null, "neutral": true, "date": "2026-06-21"}, {"home": "Spain", "away": "Saudi Arabia", "hs": null, "aw": null, "neutral": true, "date": "2026-06-21"}, {"home": "Uruguay", "away": "Cape Verde", "hs": null, "aw": null, "neutral": true, "date": "2026-06-21"}, {"home": "France", "away": "Iraq", "hs": null, "aw": null, "neutral": true, "date": "2026-06-22"}, {"home": "Norway", "away": "Senegal", "hs": null, "aw": null, "neutral": true, "date": "2026-06-22"}, {"home": "Argentina", "away": "Austria", "hs": null, "aw": null, "neutral": true, "date": "2026-06-22"}, {"home": "Jordan", "away": "Algeria", "hs": null, "aw": null, "neutral": true, "date": "2026-06-22"}, {"home": "Portugal", "away": "Uzbekistan", "hs": null, "aw": null, "neutral": true, "date": "2026-06-23"}, {"home": "Colombia", "away": "DR Congo", "hs": null, "aw": null, "neutral": true, "date": "2026-06-23"}, {"home": "England", "away": "Ghana", "hs": null, "aw": null, "neutral": true, "date": "2026-06-23"}, {"home": "Panama", "away": "Croatia", "hs": null, "aw": null, "neutral": true, "date": "2026-06-23"}, {"home": "Mexico", "away": "Czech Republic", "hs": null, "aw": null, "neutral": false, "date": "2026-06-24"}, {"home": "South Africa", "away": "South Korea", "hs": null, "aw": null, "neutral": true, "date": "2026-06-24"}, {"home": "Canada", "away": "Switzerland", "hs": null, "aw": null, "neutral": false, "date": "2026-06-24"}, {"home": "Bosnia and Herzegovina", "away": "Qatar", "hs": null, "aw": null, "neutral": true, "date": "2026-06-24"}, {"home": "Scotland", "away": "Brazil", "hs": null, "aw": null, "neutral": true, "date": "2026-06-24"}, {"home": "Morocco", "away": "Haiti", "hs": null, "aw": null, "neutral": true, "date": "2026-06-24"}, {"home": "United States", "away": "Turkey", "hs": null, "aw": null, "neutral": false, "date": "2026-06-25"}, {"home": "Paraguay", "away": "Australia", "hs": null, "aw": null, "neutral": true, "date": "2026-06-25"}, {"home": "Curaçao", "away": "Ivory Coast", "hs": null, "aw": null, "neutral": true, "date": "2026-06-25"}, {"home": "Ecuador", "away": "Germany", "hs": null, "aw": null, "neutral": true, "date": "2026-06-25"}, {"home": "Japan", "away": "Sweden", "hs": null, "aw": null, "neutral": true, "date": "2026-06-25"}, {"home": "Tunisia", "away": "Netherlands", "hs": null, "aw": null, "neutral": true, "date": "2026-06-25"}, {"home": "Egypt", "away": "Iran", "hs": null, "aw": null, "neutral": true, "date": "2026-06-26"}, {"home": "New Zealand", "away": "Belgium", "hs": null, "aw": null, "neutral": true, "date": "2026-06-26"}, {"home": "Cape Verde", "away": "Saudi Arabia", "hs": null, "aw": null, "neutral": true, "date": "2026-06-26"}, {"home": "Uruguay", "away": "Spain", "hs": null, "aw": null, "neutral": true, "date": "2026-06-26"}, {"home": "Norway", "away": "France", "hs": null, "aw": null, "neutral": true, "date": "2026-06-26"}, {"home": "Senegal", "away": "Iraq", "hs": null, "aw": null, "neutral": true, "date": "2026-06-26"}, {"home": "Algeria", "away": "Austria", "hs": null, "aw": null, "neutral": true, "date": "2026-06-27"}, {"home": "Jordan", "away": "Argentina", "hs": null, "aw": null, "neutral": true, "date": "2026-06-27"}, {"home": "Colombia", "away": "Portugal", "hs": null, "aw": null, "neutral": true, "date": "2026-06-27"}, {"home": "DR Congo", "away": "Uzbekistan", "hs": null, "aw": null, "neutral": true, "date": "2026-06-27"}, {"home": "Panama", "away": "England", "hs": null, "aw": null, "neutral": true, "date": "2026-06-27"}, {"home": "Croatia", "away": "Ghana", "hs": null, "aw": null, "neutral": true, "date": "2026-06-27"}];

const THIRD_PLACE_COMBOS = ["EFGHIJKL:EJIFHGLK", "DFGHIJKL:HGIDJFLK", "DEGHIJKL:EJIDHGLK", "DEFHIJKL:EJIDHFLK", "DEFGIJKL:EGIDJFLK", "DEFGHJKL:EGJDHFLK", "DEFGHIKL:EGIDHFLK", "DEFGHIJL:EGJDHFLI", "DEFGHIJK:EGJDHFIK", "CFGHIJKL:HGICJFLK", "CEGHIJKL:EJICHGLK", "CEFHIJKL:EJICHFLK", "CEFGIJKL:EGICJFLK", "CEFGHJKL:EGJCHFLK", "CEFGHIKL:EGICHFLK", "CEFGHIJL:EGJCHFLI", "CEFGHIJK:EGJCHFIK", "CDGHIJKL:HGICJDLK", "CDFHIJKL:CJIDHFLK", "CDFGIJKL:CGIDJFLK", "CDFGHJKL:CGJDHFLK", "CDFGHIKL:CGIDHFLK", "CDFGHIJL:CGJDHFLI", "CDFGHIJK:CGJDHFIK", "CDEHIJKL:EJICHDLK", "CDEGIJKL:EGICJDLK", "CDEGHJKL:EGJCHDLK", "CDEGHIKL:EGICHDLK", "CDEGHIJL:EGJCHDLI", "CDEGHIJK:EGJCHDIK", "CDEFIJKL:CJEDIFLK", "CDEFHJKL:CJEDHFLK", "CDEFHIKL:CEIDHFLK", "CDEFHIJL:CJEDHFLI", "CDEFHIJK:CJEDHFIK", "CDEFGJKL:CGEDJFLK", "CDEFGIKL:CGEDIFLK", "CDEFGIJL:CGEDJFLI", "CDEFGIJK:CGEDJFIK", "CDEFGHKL:CGEDHFLK", "CDEFGHJL:CGJDHFLE", "CDEFGHJK:CGJDHFEK", "CDEFGHIL:CGEDHFLI", "CDEFGHIK:CGEDHFIK", "CDEFGHIJ:CGJDHFEI", "BFGHIJKL:HJBFIGLK", "BEGHIJKL:EJIBHGLK", "BEFHIJKL:EJBFIHLK", "BEFGIJKL:EJBFIGLK", "BEFGHJKL:EJBFHGLK", "BEFGHIKL:EGBFIHLK", "BEFGHIJL:EJBFHGLI", "BEFGHIJK:EJBFHGIK", "BDGHIJKL:HJBDIGLK", "BDFHIJKL:HJBDIFLK", "BDFGIJKL:IGBDJFLK", "BDFGHJKL:HGBDJFLK", "BDFGHIKL:HGBDIFLK", "BDFGHIJL:HGBDJFLI", "BDFGHIJK:HGBDJFIK", "BDEHIJKL:EJBDIHLK", "BDEGIJKL:EJBDIGLK", "BDEGHJKL:EJBDHGLK", "BDEGHIKL:EGBDIHLK", "BDEGHIJL:EJBDHGLI", "BDEGHIJK:EJBDHGIK", "BDEFIJKL:EJBDIFLK", "BDEFHJKL:EJBDHFLK", "BDEFHIKL:EIBDHFLK", "BDEFHIJL:EJBDHFLI", "BDEFHIJK:EJBDHFIK", "BDEFGJKL:EGBDJFLK", "BDEFGIKL:EGBDIFLK", "BDEFGIJL:EGBDJFLI", "BDEFGIJK:EGBDJFIK", "BDEFGHKL:EGBDHFLK", "BDEFGHJL:HGBDJFLE", "BDEFGHJK:HGBDJFEK", "BDEFGHIL:EGBDHFLI", "BDEFGHIK:EGBDHFIK", "BDEFGHIJ:HGBDJFEI", "BCGHIJKL:HJBCIGLK", "BCFHIJKL:HJBCIFLK", "BCFGIJKL:IGBCJFLK", "BCFGHJKL:HGBCJFLK", "BCFGHIKL:HGBCIFLK", "BCFGHIJL:HGBCJFLI", "BCFGHIJK:HGBCJFIK", "BCEHIJKL:EJBCIHLK", "BCEGIJKL:EJBCIGLK", "BCEGHJKL:EJBCHGLK", "BCEGHIKL:EGBCIHLK", "BCEGHIJL:EJBCHGLI", "BCEGHIJK:EJBCHGIK", "BCEFIJKL:EJBCIFLK", "BCEFHJKL:EJBCHFLK", "BCEFHIKL:EIBCHFLK", "BCEFHIJL:EJBCHFLI", "BCEFHIJK:EJBCHFIK", "BCEFGJKL:EGBCJFLK", "BCEFGIKL:EGBCIFLK", "BCEFGIJL:EGBCJFLI", "BCEFGIJK:EGBCJFIK", "BCEFGHKL:EGBCHFLK", "BCEFGHJL:HGBCJFLE", "BCEFGHJK:HGBCJFEK", "BCEFGHIL:EGBCHFLI", "BCEFGHIK:EGBCHFIK", "BCEFGHIJ:HGBCJFEI", "BCDHIJKL:HJBCIDLK", "BCDGIJKL:IGBCJDLK", "BCDGHJKL:HGBCJDLK", "BCDGHIKL:HGBCIDLK", "BCDGHIJL:HGBCJDLI", "BCDGHIJK:HGBCJDIK", "BCDFIJKL:CJBDIFLK", "BCDFHJKL:CJBDHFLK", "BCDFHIKL:CIBDHFLK", "BCDFHIJL:CJBDHFLI", "BCDFHIJK:CJBDHFIK", "BCDFGJKL:CGBDJFLK", "BCDFGIKL:CGBDIFLK", "BCDFGIJL:CGBDJFLI", "BCDFGIJK:CGBDJFIK", "BCDFGHKL:CGBDHFLK", "BCDFGHJL:CGBDHFLJ", "BCDFGHJK:HGBCJFDK", "BCDFGHIL:CGBDHFLI", "BCDFGHIK:CGBDHFIK", "BCDFGHIJ:HGBCJFDI", "BCDEIJKL:EJBCIDLK", "BCDEHJKL:EJBCHDLK", "BCDEHIKL:EIBCHDLK", "BCDEHIJL:EJBCHDLI", "BCDEHIJK:EJBCHDIK", "BCDEGJKL:EGBCJDLK", "BCDEGIKL:EGBCIDLK", "BCDEGIJL:EGBCJDLI", "BCDEGIJK:EGBCJDIK", "BCDEGHKL:EGBCHDLK", "BCDEGHJL:HGBCJDLE", "BCDEGHJK:HGBCJDEK", "BCDEGHIL:EGBCHDLI", "BCDEGHIK:EGBCHDIK", "BCDEGHIJ:HGBCJDEI", "BCDEFJKL:CJBDEFLK", "BCDEFIKL:CEBDIFLK", "BCDEFIJL:CJBDEFLI", "BCDEFIJK:CJBDEFIK", "BCDEFHKL:CEBDHFLK", "BCDEFHJL:CJBDHFLE", "BCDEFHJK:CJBDHFEK", "BCDEFHIL:CEBDHFLI", "BCDEFHIK:CEBDHFIK", "BCDEFHIJ:CJBDHFEI", "BCDEFGKL:CGBDEFLK", "BCDEFGJL:CGBDJFLE", "BCDEFGJK:CGBDJFEK", "BCDEFGIL:CGBDEFLI", "BCDEFGIK:CGBDEFIK", "BCDEFGIJ:CGBDJFEI", "BCDEFGHL:CGBDHFLE", "BCDEFGHK:CGBDHFEK", "BCDEFGHJ:HGBCJFDE", "BCDEFGHI:CGBDHFEI", "AFGHIJKL:HJIFAGLK", "AEGHIJKL:EJIAHGLK", "AEFHIJKL:EJIFAHLK", "AEFGIJKL:EJIFAGLK", "AEFGHJKL:EGJFAHLK", "AEFGHIKL:EGIFAHLK", "AEFGHIJL:EGJFAHLI", "AEFGHIJK:EGJFAHIK", "ADGHIJKL:HJIDAGLK", "ADFHIJKL:HJIDAFLK", "ADFGIJKL:IGJDAFLK", "ADFGHJKL:HGJDAFLK", "ADFGHIKL:HGIDAFLK", "ADFGHIJL:HGJDAFLI", "ADFGHIJK:HGJDAFIK", "ADEHIJKL:EJIDAHLK", "ADEGIJKL:EJIDAGLK", "ADEGHJKL:EGJDAHLK", "ADEGHIKL:EGIDAHLK", "ADEGHIJL:EGJDAHLI", "ADEGHIJK:EGJDAHIK", "ADEFIJKL:EJIDAFLK", "ADEFHJKL:HJEDAFLK", "ADEFHIKL:HEIDAFLK", "ADEFHIJL:HJEDAFLI", "ADEFHIJK:HJEDAFIK", "ADEFGJKL:EGJDAFLK", "ADEFGIKL:EGIDAFLK", "ADEFGIJL:EGJDAFLI", "ADEFGIJK:EGJDAFIK", "ADEFGHKL:HGEDAFLK", "ADEFGHJL:HGJDAFLE", "ADEFGHJK:HGJDAFEK", "ADEFGHIL:HGEDAFLI", "ADEFGHIK:HGEDAFIK", "ADEFGHIJ:HGJDAFEI", "ACGHIJKL:HJICAGLK", "ACFHIJKL:HJICAFLK", "ACFGIJKL:IGJCAFLK", "ACFGHJKL:HGJCAFLK", "ACFGHIKL:HGICAFLK", "ACFGHIJL:HGJCAFLI", "ACFGHIJK:HGJCAFIK", "ACEHIJKL:EJICAHLK", "ACEGIJKL:EJICAGLK", "ACEGHJKL:EGJCAHLK", "ACEGHIKL:EGICAHLK", "ACEGHIJL:EGJCAHLI", "ACEGHIJK:EGJCAHIK", "ACEFIJKL:EJICAFLK", "ACEFHJKL:HJECAFLK", "ACEFHIKL:HEICAFLK", "ACEFHIJL:HJECAFLI", "ACEFHIJK:HJECAFIK", "ACEFGJKL:EGJCAFLK", "ACEFGIKL:EGICAFLK", "ACEFGIJL:EGJCAFLI", "ACEFGIJK:EGJCAFIK", "ACEFGHKL:HGECAFLK", "ACEFGHJL:HGJCAFLE", "ACEFGHJK:HGJCAFEK", "ACEFGHIL:HGECAFLI", "ACEFGHIK:HGECAFIK", "ACEFGHIJ:HGJCAFEI", "ACDHIJKL:HJICADLK", "ACDGIJKL:IGJCADLK", "ACDGHJKL:HGJCADLK", "ACDGHIKL:HGICADLK", "ACDGHIJL:HGJCADLI", "ACDGHIJK:HGJCADIK", "ACDFIJKL:CJIDAFLK", "ACDFHJKL:HJFCADLK", "ACDFHIKL:HFICADLK", "ACDFHIJL:HJFCADLI", "ACDFHIJK:HJFCADIK", "ACDFGJKL:CGJDAFLK", "ACDFGIKL:CGIDAFLK", "ACDFGIJL:CGJDAFLI", "ACDFGIJK:CGJDAFIK", "ACDFGHKL:HGFCADLK", "ACDFGHJL:CGJDAFLH", "ACDFGHJK:HGJCAFDK", "ACDFGHIL:HGFCADLI", "ACDFGHIK:HGFCADIK", "ACDFGHIJ:HGJCAFDI", "ACDEIJKL:EJICADLK", "ACDEHJKL:HJECADLK", "ACDEHIKL:HEICADLK", "ACDEHIJL:HJECADLI", "ACDEHIJK:HJECADIK", "ACDEGJKL:EGJCADLK", "ACDEGIKL:EGICADLK", "ACDEGIJL:EGJCADLI", "ACDEGIJK:EGJCADIK", "ACDEGHKL:HGECADLK", "ACDEGHJL:HGJCADLE", "ACDEGHJK:HGJCADEK", "ACDEGHIL:HGECADLI", "ACDEGHIK:HGECADIK", "ACDEGHIJ:HGJCADEI", "ACDEFJKL:CJEDAFLK", "ACDEFIKL:CEIDAFLK", "ACDEFIJL:CJEDAFLI", "ACDEFIJK:CJEDAFIK", "ACDEFHKL:HEFCADLK", "ACDEFHJL:HJFCADLE", "ACDEFHJK:HJECAFDK", "ACDEFHIL:HEFCADLI", "ACDEFHIK:HEFCADIK", "ACDEFHIJ:HJECAFDI", "ACDEFGKL:CGEDAFLK", "ACDEFGJL:CGJDAFLE", "ACDEFGJK:CGJDAFEK", "ACDEFGIL:CGEDAFLI", "ACDEFGIK:CGEDAFIK", "ACDEFGIJ:CGJDAFEI", "ACDEFGHL:HGFCADLE", "ACDEFGHK:HGECAFDK", "ACDEFGHJ:HGJCAFDE", "ACDEFGHI:HGECAFDI", "ABGHIJKL:HJBAIGLK", "ABFHIJKL:HJBAIFLK", "ABFGIJKL:IJBFAGLK", "ABFGHJKL:HJBFAGLK", "ABFGHIKL:HGBAIFLK", "ABFGHIJL:HJBFAGLI", "ABFGHIJK:HJBFAGIK", "ABEHIJKL:EJBAIHLK", "ABEGIJKL:EJBAIGLK", "ABEGHJKL:EJBAHGLK", "ABEGHIKL:EGBAIHLK", "ABEGHIJL:EJBAHGLI", "ABEGHIJK:EJBAHGIK", "ABEFIJKL:EJBAIFLK", "ABEFHJKL:EJBFAHLK", "ABEFHIKL:EIBFAHLK", "ABEFHIJL:EJBFAHLI", "ABEFHIJK:EJBFAHIK", "ABEFGJKL:EJBFAGLK", "ABEFGIKL:EGBAIFLK", "ABEFGIJL:EJBFAGLI", "ABEFGIJK:EJBFAGIK", "ABEFGHKL:EGBFAHLK", "ABEFGHJL:HJBFAGLE", "ABEFGHJK:HJBFAGEK", "ABEFGHIL:EGBFAHLI", "ABEFGHIK:EGBFAHIK", "ABEFGHIJ:HJBFAGEI", "ABDHIJKL:IJBDAHLK", "ABDGIJKL:IJBDAGLK", "ABDGHJKL:HJBDAGLK", "ABDGHIKL:IGBDAHLK", "ABDGHIJL:HJBDAGLI", "ABDGHIJK:HJBDAGIK", "ABDFIJKL:IJBDAFLK", "ABDFHJKL:HJBDAFLK", "ABDFHIKL:HIBDAFLK", "ABDFHIJL:HJBDAFLI", "ABDFHIJK:HJBDAFIK", "ABDFGJKL:FJBDAGLK", "ABDFGIKL:IGBDAFLK", "ABDFGIJL:FJBDAGLI", "ABDFGIJK:FJBDAGIK", "ABDFGHKL:HGBDAFLK", "ABDFGHJL:HGBDAFLJ", "ABDFGHJK:HGBDAFJK", "ABDFGHIL:HGBDAFLI", "ABDFGHIK:HGBDAFIK", "ABDFGHIJ:HGBDAFIJ", "ABDEIJKL:EJBAIDLK", "ABDEHJKL:EJBDAHLK", "ABDEHIKL:EIBDAHLK", "ABDEHIJL:EJBDAHLI", "ABDEHIJK:EJBDAHIK", "ABDEGJKL:EJBDAGLK", "ABDEGIKL:EGBAIDLK", "ABDEGIJL:EJBDAGLI", "ABDEGIJK:EJBDAGIK", "ABDEGHKL:EGBDAHLK", "ABDEGHJL:HJBDAGLE", "ABDEGHJK:HJBDAGEK", "ABDEGHIL:EGBDAHLI", "ABDEGHIK:EGBDAHIK", "ABDEGHIJ:HJBDAGEI", "ABDEFJKL:EJBDAFLK", "ABDEFIKL:EIBDAFLK", "ABDEFIJL:EJBDAFLI", "ABDEFIJK:EJBDAFIK", "ABDEFHKL:HEBDAFLK", "ABDEFHJL:HJBDAFLE", "ABDEFHJK:HJBDAFEK", "ABDEFHIL:HEBDAFLI", "ABDEFHIK:HEBDAFIK", "ABDEFHIJ:HJBDAFEI", "ABDEFGKL:EGBDAFLK", "ABDEFGJL:EGBDAFLJ", "ABDEFGJK:EGBDAFJK", "ABDEFGIL:EGBDAFLI", "ABDEFGIK:EGBDAFIK", "ABDEFGIJ:EGBDAFIJ", "ABDEFGHL:HGBDAFLE", "ABDEFGHK:HGBDAFEK", "ABDEFGHJ:HGBDAFEJ", "ABDEFGHI:HGBDAFEI", "ABCHIJKL:IJBCAHLK", "ABCGIJKL:IJBCAGLK", "ABCGHJKL:HJBCAGLK", "ABCGHIKL:IGBCAHLK", "ABCGHIJL:HJBCAGLI", "ABCGHIJK:HJBCAGIK", "ABCFIJKL:IJBCAFLK", "ABCFHJKL:HJBCAFLK", "ABCFHIKL:HIBCAFLK", "ABCFHIJL:HJBCAFLI", "ABCFHIJK:HJBCAFIK", "ABCFGJKL:CJBFAGLK", "ABCFGIKL:IGBCAFLK", "ABCFGIJL:CJBFAGLI", "ABCFGIJK:CJBFAGIK", "ABCFGHKL:HGBCAFLK", "ABCFGHJL:HGBCAFLJ", "ABCFGHJK:HGBCAFJK", "ABCFGHIL:HGBCAFLI", "ABCFGHIK:HGBCAFIK", "ABCFGHIJ:HGBCAFIJ", "ABCEIJKL:EJBAICLK", "ABCEHJKL:EJBCAHLK", "ABCEHIKL:EIBCAHLK", "ABCEHIJL:EJBCAHLI", "ABCEHIJK:EJBCAHIK", "ABCEGJKL:EJBCAGLK", "ABCEGIKL:EGBAICLK", "ABCEGIJL:EJBCAGLI", "ABCEGIJK:EJBCAGIK", "ABCEGHKL:EGBCAHLK", "ABCEGHJL:HJBCAGLE", "ABCEGHJK:HJBCAGEK", "ABCEGHIL:EGBCAHLI", "ABCEGHIK:EGBCAHIK", "ABCEGHIJ:HJBCAGEI", "ABCEFJKL:EJBCAFLK", "ABCEFIKL:EIBCAFLK", "ABCEFIJL:EJBCAFLI", "ABCEFIJK:EJBCAFIK", "ABCEFHKL:HEBCAFLK", "ABCEFHJL:HJBCAFLE", "ABCEFHJK:HJBCAFEK", "ABCEFHIL:HEBCAFLI", "ABCEFHIK:HEBCAFIK", "ABCEFHIJ:HJBCAFEI", "ABCEFGKL:EGBCAFLK", "ABCEFGJL:EGBCAFLJ", "ABCEFGJK:EGBCAFJK", "ABCEFGIL:EGBCAFLI", "ABCEFGIK:EGBCAFIK", "ABCEFGIJ:EGBCAFIJ", "ABCEFGHL:HGBCAFLE", "ABCEFGHK:HGBCAFEK", "ABCEFGHJ:HGBCAFEJ", "ABCEFGHI:HGBCAFEI", "ABCDIJKL:IJBCADLK", "ABCDHJKL:HJBCADLK", "ABCDHIKL:HIBCADLK", "ABCDHIJL:HJBCADLI", "ABCDHIJK:HJBCADIK", "ABCDGJKL:CJBDAGLK", "ABCDGIKL:IGBCADLK", "ABCDGIJL:CJBDAGLI", "ABCDGIJK:CJBDAGIK", "ABCDGHKL:HGBCADLK", "ABCDGHJL:HGBCADLJ", "ABCDGHJK:HGBCADJK", "ABCDGHIL:HGBCADLI", "ABCDGHIK:HGBCADIK", "ABCDGHIJ:HGBCADIJ", "ABCDFJKL:CJBDAFLK", "ABCDFIKL:CIBDAFLK", "ABCDFIJL:CJBDAFLI", "ABCDFIJK:CJBDAFIK", "ABCDFHKL:HFBCADLK", "ABCDFHJL:CJBDAFLH", "ABCDFHJK:HJBCAFDK", "ABCDFHIL:HFBCADLI", "ABCDFHIK:HFBCADIK", "ABCDFHIJ:HJBCAFDI", "ABCDFGKL:CGBDAFLK", "ABCDFGJL:CGBDAFLJ", "ABCDFGJK:CGBDAFJK", "ABCDFGIL:CGBDAFLI", "ABCDFGIK:CGBDAFIK", "ABCDFGIJ:CGBDAFIJ", "ABCDFGHL:CGBDAFLH", "ABCDFGHK:HGBCAFDK", "ABCDFGHJ:HGBCAFDJ", "ABCDFGHI:HGBCAFDI", "ABCDEJKL:EJBCADLK", "ABCDEIKL:EIBCADLK", "ABCDEIJL:EJBCADLI", "ABCDEIJK:EJBCADIK", "ABCDEHKL:HEBCADLK", "ABCDEHJL:HJBCADLE", "ABCDEHJK:HJBCADEK", "ABCDEHIL:HEBCADLI", "ABCDEHIK:HEBCADIK", "ABCDEHIJ:HJBCADEI", "ABCDEGKL:EGBCADLK", "ABCDEGJL:EGBCADLJ", "ABCDEGJK:EGBCADJK", "ABCDEGIL:EGBCADLI", "ABCDEGIK:EGBCADIK", "ABCDEGIJ:EGBCADIJ", "ABCDEGHL:HGBCADLE", "ABCDEGHK:HGBCADEK", "ABCDEGHJ:HGBCADEJ", "ABCDEGHI:HGBCADEI", "ABCDEFKL:CEBDAFLK", "ABCDEFJL:CJBDAFLE", "ABCDEFJK:CJBDAFEK", "ABCDEFIL:CEBDAFLI", "ABCDEFIK:CEBDAFIK", "ABCDEFIJ:CJBDAFEI", "ABCDEFHL:HFBCADLE", "ABCDEFHK:HEBCAFDK", "ABCDEFHJ:HJBCAFDE", "ABCDEFHI:HEBCAFDI", "ABCDEFGL:CGBDAFLE", "ABCDEFGK:CGBDAFEK", "ABCDEFGJ:CGBDAFEJ", "ABCDEFGI:CGBDAFEI", "ABCDEFGH:HGBCAFDE"];

const KNOCKOUT_STRUCTURE = {"r32": {"73": [["2", "A"], ["2", "B"]], "74": [["1", "E"], ["3", "ABCDF"]], "75": [["1", "F"], ["2", "C"]], "76": [["1", "C"], ["2", "F"]], "77": [["1", "I"], ["3", "CDFGH"]], "78": [["2", "E"], ["2", "I"]], "79": [["1", "A"], ["3", "CEFHI"]], "80": [["1", "L"], ["3", "EHIJK"]], "81": [["1", "D"], ["3", "BEFIJ"]], "82": [["1", "G"], ["3", "AEHIJ"]], "83": [["2", "K"], ["2", "L"]], "84": [["1", "H"], ["2", "J"]], "85": [["1", "B"], ["3", "EFGIJ"]], "86": [["1", "J"], ["2", "H"]], "87": [["1", "K"], ["3", "DEIJL"]], "88": [["2", "D"], ["2", "G"]]}, "r16": {"89": [["W", 74], ["W", 77]], "90": [["W", 73], ["W", 75]], "91": [["W", 76], ["W", 78]], "92": [["W", 79], ["W", 80]], "93": [["W", 83], ["W", 84]], "94": [["W", 81], ["W", 82]], "95": [["W", 86], ["W", 88]], "96": [["W", 85], ["W", 87]]}, "qf": {"97": [["W", 89], ["W", 90]], "98": [["W", 93], ["W", 94]], "99": [["W", 91], ["W", 92]], "100": [["W", 95], ["W", 96]]}, "sf": {"101": [["W", 97], ["W", 98]], "102": [["W", 99], ["W", 100]]}, "third_place": {"103": [["L", 101], ["L", 102]]}, "final": {"104": [["W", 101], ["W", 102]]}};

// ============================================================
// PREDICTION ENGINE (mirrors predict_match.py / simulate.py)
// ============================================================

const AVG_GOALS = 1.386;
const MAX_GOALS = 6;
const FORM_ELO_K = 24;
const FORM_ELO_CAP = 45;
const FORM_RATIO_DAMPING = 0.45;
const FORM_RATIO_CAP = 0.14;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const APP_STATE_TABLE = 'app_state';
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function poissonPmf(k, lam) {
  return Math.exp(-lam) * Math.pow(lam, k) / factorial(k);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getTeamMetrics(team, formState = null) {
  const base = TEAM_DATA[team] || { elo: 1500, atk: 1, def: 1 };
  if (!formState || !formState[team]) {
    return { elo: base.elo, atk: base.atk, def: base.def };
  }
  const form = formState[team];
  return {
    elo: base.elo + form.eloDelta,
    atk: clamp(base.atk * form.atkFactor, 0.35, 2.6),
    def: clamp(base.def * form.defFactor, 0.2, 2.2),
  };
}

function getMatchModel(homeTeam, awayTeam, neutral, formState = null) {
  const home = getTeamMetrics(homeTeam, formState);
  const away = getTeamMetrics(awayTeam, formState);
  const homeAdvElo = neutral ? 0 : 65;
  const homeAdvGoals = neutral ? 0 : 0.08;
  const expectedHomeNoDraw = 1 / (1 + Math.pow(10, -((home.elo + homeAdvElo) - away.elo) / 400));
  const lamHome = Math.max(0.15, AVG_GOALS * home.atk * away.def + homeAdvGoals);
  const lamAway = Math.max(0.15, AVG_GOALS * away.atk * home.def);
  return { home, away, homeAdvElo, expectedHomeNoDraw, lamHome, lamAway };
}

function accumulateFormSample(samples, homeTeam, awayTeam, hs, aw, neutral = true, penaltyWinner) {
  if (!TEAM_DATA[homeTeam] || !TEAM_DATA[awayTeam]) return;
  const { expectedHomeNoDraw, lamHome, lamAway } = getMatchModel(homeTeam, awayTeam, neutral, null);
  let actualHome = 0.5;
  if (hs > aw) actualHome = 1;
  else if (hs < aw) actualHome = 0;
  else if (penaltyWinner === 'home') actualHome = 1;
  else if (penaltyWinner === 'away') actualHome = 0;

  const delta = clamp((actualHome - expectedHomeNoDraw) * FORM_ELO_K, -18, 18);

  if (!samples[homeTeam]) samples[homeTeam] = { eloSum: 0, atkLogSum: 0, defLogSum: 0, matches: 0 };
  if (!samples[awayTeam]) samples[awayTeam] = { eloSum: 0, atkLogSum: 0, defLogSum: 0, matches: 0 };

  samples[homeTeam].eloSum += delta;
  samples[awayTeam].eloSum -= delta;
  samples[homeTeam].atkLogSum += Math.log((hs + 0.35) / (lamHome + 0.35));
  samples[homeTeam].defLogSum += Math.log((aw + 0.35) / (lamAway + 0.35));
  samples[awayTeam].atkLogSum += Math.log((aw + 0.35) / (lamAway + 0.35));
  samples[awayTeam].defLogSum += Math.log((hs + 0.35) / (lamHome + 0.35));
  samples[homeTeam].matches += 1;
  samples[awayTeam].matches += 1;
}

function computeTournamentForm(fixtures, knockoutScores = {}, liveBracket = null) {
  const samples = {};

  fixtures.forEach((match) => {
    if (match.hs === null || match.hs === undefined || match.aw === null || match.aw === undefined) return;
    accumulateFormSample(samples, match.home, match.away, match.hs, match.aw, match.neutral);
  });

  if (liveBracket) {
    Object.entries(knockoutScores).forEach(([matchId, score]) => {
      if (!score || score.hs === null || score.hs === undefined || score.aw === null || score.aw === undefined) return;
      const teams = liveBracket.teamOf[matchId];
      if (!teams || !teams[0] || !teams[1]) return;
      accumulateFormSample(samples, teams[0], teams[1], score.hs, score.aw, true, score.pen);
    });
  }

  const result = {};
  Object.entries(samples).forEach(([team, sample]) => {
    const shrink = sample.matches / (sample.matches + 2);
    const atkShift = clamp((sample.atkLogSum / sample.matches) * FORM_RATIO_DAMPING * shrink, -FORM_RATIO_CAP, FORM_RATIO_CAP);
    const defShift = clamp((sample.defLogSum / sample.matches) * FORM_RATIO_DAMPING * shrink, -FORM_RATIO_CAP, FORM_RATIO_CAP);
    result[team] = {
      matches: sample.matches,
      eloDelta: clamp(sample.eloSum * shrink, -FORM_ELO_CAP, FORM_ELO_CAP),
      atkFactor: Math.exp(atkShift),
      defFactor: Math.exp(defShift),
    };
  });

  return result;
}

function eloTo1x2(eloHome, eloAway, homeAdv) {
  const diff = (eloHome + homeAdv) - eloAway;
  const pHomeNoDraw = 1 / (1 + Math.pow(10, -diff / 400));
  const drawBase = 0.28;
  const drawFloor = 0.12;
  const scale = 600;
  const pDraw = drawFloor + (drawBase - drawFloor) * Math.exp(-Math.pow(diff / scale, 2));
  const pHome = pHomeNoDraw * (1 - pDraw);
  const pAway = (1 - pHomeNoDraw) * (1 - pDraw);
  return { pHome, pDraw, pAway };
}

function predictMatch(homeTeam, awayTeam, neutral, formState = null) {
  const baseHome = TEAM_DATA[homeTeam];
  const baseAway = TEAM_DATA[awayTeam];
  const activeForm = formState || null;
  const { home, away, homeAdvElo, lamHome, lamAway } = getMatchModel(homeTeam, awayTeam, neutral, activeForm);

  const { pHome, pDraw, pAway } = eloTo1x2(home.elo, away.elo, homeAdvElo);

  const scoreGrid = [];
  let mostLikely = { h: 0, a: 0, p: 0 };
  for (let h = 0; h <= MAX_GOALS; h++) {
    const row = [];
    for (let a = 0; a <= MAX_GOALS; a++) {
      const p = poissonPmf(h, lamHome) * poissonPmf(a, lamAway);
      row.push(p);
      if (p > mostLikely.p) mostLikely = { h, a, p };
    }
    scoreGrid.push(row);
  }

  let over25 = 0, btts = 0;
  for (let h = 0; h <= MAX_GOALS; h++) {
    for (let a = 0; a <= MAX_GOALS; a++) {
      const p = scoreGrid[h][a];
      if (h + a > 2.5) over25 += p;
      if (h > 0 && a > 0) btts += p;
    }
  }

  const expectedScore = { h: Math.round(lamHome), a: Math.round(lamAway) };

  return {
    home: homeTeam, away: awayTeam,
    baseEloHome: baseHome.elo, baseEloAway: baseAway.elo,
    eloH: home.elo, eloA: away.elo,
    pHome, pDraw, pAway, lamHome, lamAway,
    scoreGrid, mostLikely, expectedScore, over25, btts,
  };
}

function knockoutWinProb(teamA, teamB, formState = null) {
  const ra = getTeamMetrics(teamA, formState).elo;
  const rb = getTeamMetrics(teamB, formState).elo;
  return 1 / (1 + Math.pow(10, -(ra - rb) / 400));
}

function playKnockout(teamA, teamB, rng, formState = null) {
  const p = knockoutWinProb(teamA, teamB, formState);
  return rng() < p ? teamA : teamB;
}

function simulateScore(home, away, neutral, rng, formState = null) {
  const { lamHome, lamAway } = getMatchModel(home, away, neutral, formState);
  return [poissonSample(lamHome, rng), poissonSample(lamAway, rng)];
}

function poissonSample(lam, rng) {
  const L = Math.exp(-lam);
  let k = 0, p = 1.0;
  do {
    k++;
    p *= rng();
  } while (p > L);
  return k - 1;
}

// Simple seeded RNG (mulberry32) so simulations can be reproduced if needed
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Run N simulations and aggregate stage-reach probabilities per team,
// using the real FIFA Round-of-32 structure (see app_part_knockout_engine.js)
// rather than a random bracket.
function runMonteCarlo(nSims, seed, fixtures, knockoutScores = {}, formState = null) {
  const rng = mulberry32(seed);
  const activeFixtures = fixtures || WC_FIXTURES;
  const allTeams = Object.keys(TEAM_DATA);
  const counts = {};
  allTeams.forEach(t => {
    counts[t] = { groupWin: 0, r32: 0, r16: 0, qf: 0, sf: 0, final: 0, champion: 0 };
  });

  for (let i = 0; i < nSims; i++) {
    const sim = simulateRealBracket(activeFixtures, knockoutScores, rng, formState);
    WC_GROUP_LABELS.forEach(g => { counts[sim.standings[g].winner].groupWin++; });
    Object.keys(KNOCKOUT_STRUCTURE.r32).forEach(matchId => {
      sim.teamOf[matchId].forEach(t => { if (t) counts[t].r32++; });
    });
    Object.keys(KNOCKOUT_STRUCTURE.r16).forEach(matchId => {
      const w = sim.winners[matchId];
      if (w) counts[w].r16++;
    });
    Object.keys(KNOCKOUT_STRUCTURE.qf).forEach(matchId => {
      const w = sim.winners[matchId];
      if (w) counts[w].qf++;
    });
    Object.keys(KNOCKOUT_STRUCTURE.sf).forEach(matchId => {
      const w = sim.winners[matchId];
      if (w) counts[w].sf++;
    });
    sim.teamOf['104'].forEach(t => { if (t) counts[t].final++; });
    if (sim.champion) counts[sim.champion].champion++;
  }

  const rows = allTeams.map(t => ({
    team: t,
    groupWin: counts[t].groupWin / nSims * 100,
    r32: counts[t].r32 / nSims * 100,
    r16: counts[t].r16 / nSims * 100,
    qf: counts[t].qf / nSims * 100,
    sf: counts[t].sf / nSims * 100,
    final: counts[t].final / nSims * 100,
    champion: counts[t].champion / nSims * 100,
  }));
  rows.sort((a, b) => b.champion - a.champion || b.final - a.final || b.sf - a.sf);
  return rows;
}

// ============================================================
// COLOR UTILITIES
// ============================================================

function hexToRgb(hex) {
  const m = hex.replace('#', '');
  const r = parseInt(m.substring(0, 2), 16);
  const g = parseInt(m.substring(2, 4), 16);
  const b = parseInt(m.substring(4, 6), 16);
  return { r, g, b };
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastTextColor(hex) {
  return relativeLuminance(hex) > 0.42 ? '#1A1A1A' : '#FFFFFF';
}

function mixWithWhite(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

// ============================================================
// REAL FIFA KNOCKOUT BRACKET ENGINE
// Replaces the earlier random-shuffle bracket with FIFA's actual fixed
// Round of 32 structure (Annex C, tournament regulations): each of the 16
// R32 matches has a fixed slot (group winner, group runner-up, or a
// "best 3rd place from groups X/Y/Z..." wildcard paired with one specific
// group's winner). Which team fills each wildcard slot depends on exactly
// which 8 of the 12 groups' third-place teams qualify, looked up from the
// 495 combinations FIFA published. Every wildcard match in the fixed
// schedule is paired with one of the group winners in
// WILDCARD_SLOT_GROUPS, and that group letter is the lookup key.
// ============================================================

const WILDCARD_SLOT_GROUPS = ['A', 'B', 'D', 'E', 'G', 'I', 'K', 'L'];

// Given the 8 qualifying third-place groups (any order), return
// { slotGroupLetter -> thirdPlaceSourceGroupLetter } using FIFA's table.
function lookupThirdPlaceSlotMap(qualifyingGroups) {
  const key = [...qualifyingGroups].sort().join('');
  const row = THIRD_PLACE_COMBOS.find(c => c.startsWith(key + ':'));
  if (!row) return null;
  const slots = row.split(':')[1];
  const map = {};
  WILDCARD_SLOT_GROUPS.forEach((g, i) => { map[g] = slots[i]; });
  return map;
}

// Compute group standings (winner, runner-up, third + their record) from
// the live fixtures, for every one of the 12 groups.
function computeAllGroupStandings(fixtures) {
  const standings = {};
  WC_GROUPS.forEach((teams, gi) => {
    const label = WC_GROUP_LABELS[gi];
    const table = {};
    teams.forEach(t => { table[t] = { pts: 0, gf: 0, ga: 0, gd: 0, played: 0 }; });
    fixtures.forEach(m => {
      if (!(m.home in table)) return;
      if (m.hs === null || m.hs === undefined || m.aw === null || m.aw === undefined) return;
      table[m.home].gf += m.hs; table[m.home].ga += m.aw; table[m.home].played++;
      table[m.away].gf += m.aw; table[m.away].ga += m.hs; table[m.away].played++;
      if (m.hs > m.aw) table[m.home].pts += 3;
      else if (m.hs < m.aw) table[m.away].pts += 3;
      else { table[m.home].pts += 1; table[m.away].pts += 1; }
    });
    teams.forEach(t => { table[t].gd = table[t].gf - table[t].ga; });
    const ranked = [...teams].sort((a, b) => {
      if (table[b].pts !== table[a].pts) return table[b].pts - table[a].pts;
      if (table[b].gd !== table[a].gd) return table[b].gd - table[a].gd;
      return table[b].gf - table[a].gf;
    });
    standings[label] = {
      winner: ranked[0], runner: ranked[1], third: ranked[2], fourth: ranked[3],
      thirdRecord: table[ranked[2]],
      groupComplete: teams.every(t => table[t].played === 3),
    };
  });
  return standings;
}

// Rank all 12 third-place teams and pick the best 8 (points -> GD -> GF).
// Returns the 8 qualifying group letters, sorted by how they rank (best first).
function rankThirdPlaceTeams(standings) {
  const labels = WC_GROUP_LABELS;
  const ranked = [...labels].sort((a, b) => {
    const ra = standings[a].thirdRecord, rb = standings[b].thirdRecord;
    if (rb.pts !== ra.pts) return rb.pts - ra.pts;
    if (rb.gd !== ra.gd) return rb.gd - ra.gd;
    return rb.gf - ra.gf;
  });
  return ranked.slice(0, 8);
}

// Build the real, FIFA-correct Round of 32 with actual team names, given
// live group fixtures. Returns null fields for any slot that can't yet be
// resolved (group stage incomplete). `knockoutScores` optionally supplies
// already-entered/edited knockout match scores keyed by match number.
function buildRealKnockoutBracket(fixtures, knockoutScores) {
  const standings = computeAllGroupStandings(fixtures);
  const allGroupsComplete = WC_GROUP_LABELS.every(g => standings[g].groupComplete);

  const bestThirdGroups = rankThirdPlaceTeams(standings);
  const slotMap = allGroupsComplete ? lookupThirdPlaceSlotMap(bestThirdGroups) : null;

  const teamOf = {}; // matchId -> [teamA, teamB] (null if not yet resolvable)

  // Round of 32: resolve every fixed slot
  Object.entries(KNOCKOUT_STRUCTURE.r32).forEach(([matchId, slots]) => {
    const resolved = slots.map(([kind, val]) => {
      if (kind === '1') return standings[val] ? standings[val].winner : null;
      if (kind === '2') return standings[val] ? standings[val].runner : null;
      if (kind === '3') {
        // val is the candidate-group string; the slot KEY is this match's
        // paired '1' group (see module doc above).
        if (!slotMap) return null;
        const pairedGroup = slots.find(s => s[0] === '1')[1];
        const sourceGroup = slotMap[pairedGroup];
        return sourceGroup && standings[sourceGroup] ? standings[sourceGroup].third : null;
      }
      return null;
    });
    teamOf[matchId] = resolved;
  });

  // Helper: get the winner of a given match (from actual entered score, or null)
  function winnerOf(matchId) {
    const teams = teamOf[matchId];
    if (!teams || !teams[0] || !teams[1]) return null;
    const score = knockoutScores[matchId];
    if (!score || score.hs === null || score.hs === undefined) return null;
    // Knockout matches can't end level -- if scores tie, a penalty winner field is used.
    if (score.hs > score.aw) return teams[0];
    if (score.aw > score.hs) return teams[1];
    if (score.pen === 'home') return teams[0];
    if (score.pen === 'away') return teams[1];
    return null; // tied with no penalty result recorded yet
  }
  function loserOf(matchId) {
    const teams = teamOf[matchId];
    const w = winnerOf(matchId);
    if (!w || !teams) return null;
    return teams[0] === w ? teams[1] : teams[0];
  }

  ['r16', 'qf', 'sf'].forEach(stage => {
    Object.entries(KNOCKOUT_STRUCTURE[stage]).forEach(([matchId, slots]) => {
      teamOf[matchId] = slots.map(([kind, ref]) => kind === 'W' ? winnerOf(String(ref)) : null);
    });
  });
  Object.entries(KNOCKOUT_STRUCTURE.final).forEach(([matchId, slots]) => {
    teamOf[matchId] = slots.map(([kind, ref]) => kind === 'W' ? winnerOf(String(ref)) : null);
  });
  Object.entries(KNOCKOUT_STRUCTURE.third_place).forEach(([matchId, slots]) => {
    teamOf[matchId] = slots.map(([kind, ref]) => kind === 'L' ? loserOf(String(ref)) : null);
  });

  return {
    standings, allGroupsComplete, bestThirdGroups, slotMap, teamOf,
    winnerOf, loserOf,
  };
}

// ---- Simulation variant: same structure, but auto-plays unresolved /
// unscored matches via Elo so the bracket can be projected forward even
// before real knockout results exist. Used by the Bracket tab.
function simulateRealBracket(fixtures, knockoutScores, rng, formState = null) {
  // First, simulate the group stage forward exactly like before, to get
  // complete standings even if some group games haven't been played.
  const simFixtures = fixtures.map(m => {
    if (m.hs !== null && m.hs !== undefined) return m;
    const [hs, aw] = simulateScore(m.home, m.away, m.neutral, rng, formState);
    return { ...m, hs, aw };
  });

  const standings = computeAllGroupStandings(simFixtures);
  const bestThirdGroups = rankThirdPlaceTeams(standings);
  const slotMap = lookupThirdPlaceSlotMap(bestThirdGroups);

  const teamOf = {};
  Object.entries(KNOCKOUT_STRUCTURE.r32).forEach(([matchId, slots]) => {
    const resolved = slots.map(([kind, val]) => {
      if (kind === '1') return standings[val].winner;
      if (kind === '2') return standings[val].runner;
      if (kind === '3') {
        const pairedGroup = slots.find(s => s[0] === '1')[1];
        const sourceGroup = slotMap[pairedGroup];
        return standings[sourceGroup].third;
      }
      return null;
    });
    teamOf[matchId] = resolved;
  });

  const winners = {};
  const losers = {};
  function playOrUseReal(matchId, teams) {
    const real = knockoutScores[matchId];
    let winner;
    if (real && real.hs !== null && real.hs !== undefined) {
      if (real.hs > real.aw) winner = teams[0];
      else if (real.aw > real.hs) winner = teams[1];
      else if (real.pen === 'home') winner = teams[0];
      else if (real.pen === 'away') winner = teams[1];
    }
    if (!winner) winner = playKnockout(teams[0], teams[1], rng, formState);
    losers[matchId] = teams[0] === winner ? teams[1] : teams[0];
    return winner;
  }

  Object.keys(KNOCKOUT_STRUCTURE.r32).forEach(matchId => {
    winners[matchId] = playOrUseReal(matchId, teamOf[matchId]);
  });
  ['r16', 'qf', 'sf'].forEach(stage => {
    Object.entries(KNOCKOUT_STRUCTURE[stage]).forEach(([matchId, slots]) => {
      const teams = slots.map(([kind, ref]) => winners[String(ref)]);
      teamOf[matchId] = teams;
      winners[matchId] = playOrUseReal(matchId, teams);
    });
  });

  // Third place playoff: the two semifinal losers
  const thirdPlaceSlots = KNOCKOUT_STRUCTURE.third_place['103'];
  const thirdPlaceTeams = thirdPlaceSlots.map(([kind, ref]) => losers[String(ref)]);
  teamOf['103'] = thirdPlaceTeams;
  winners['103'] = playOrUseReal('103', thirdPlaceTeams);

  const finalSlots = KNOCKOUT_STRUCTURE.final['104'];
  const finalTeams = finalSlots.map(([kind, ref]) => winners[String(ref)]);
  teamOf['104'] = finalTeams;
  const champion = playOrUseReal('104', finalTeams);
  winners['104'] = champion;

  return { standings, bestThirdGroups, slotMap, teamOf, winners, losers, champion, thirdPlaceWinner: winners['103'] };
}

function buildDisplayBracket(liveBracket, simBracket) {
  const teamOf = {};
  const winners = {};
  const allMatchIds = Object.values(KNOCKOUT_STRUCTURE).flatMap(stage => Object.keys(stage));

  allMatchIds.forEach(matchId => {
    const liveTeams = liveBracket.teamOf[matchId] || [];
    const simTeams = simBracket.teamOf[matchId] || [];
    teamOf[matchId] = [0, 1].map(idx => liveTeams[idx] || simTeams[idx] || null);

    if (liveBracket.winnerOf) {
      const liveWinner = liveBracket.winnerOf(matchId);
      if (liveWinner) {
        winners[matchId] = liveWinner;
        return;
      }
    }
    winners[matchId] = simBracket.winners ? simBracket.winners[matchId] : null;
  });

  return {
    teamOf,
    winners,
    champion: winners['104'] || null,
    thirdPlaceWinner: winners['103'] || null,
  };
}

// ============================================================
// DESIGN TOKENS
// ============================================================

const COLORS = {
  bg: '#FFFFFF',
  bgSubtle: '#FAFAFA',
  surface: '#F5F5F4',
  border: '#E7E5E2',
  borderStrong: '#D4D1CB',
  ink: '#1A1A1A',
  inkSoft: '#6B6862',
  inkFaint: '#9C9890',
  accent: '#1A1A1A',
};

const FONT_DISPLAY = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const FONT_MONO = '"SF Mono", "JetBrains Mono", "Courier New", monospace';

// ============================================================
// FLAG COMPONENT
// ============================================================

function Flag({ team, size = 28 }) {
  const data = TEAM_DATA[team];
  if (!data) return null;
  const h = size;
  const w = size * 1.5;
  return (
    <svg
      width={w} height={h} viewBox="0 0 24 16"
      style={{ borderRadius: 2, display: 'block', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)', flexShrink: 0 }}
      role="img"
      aria-label={`Flag of ${team}`}
      dangerouslySetInnerHTML={{ __html: data.flag }}
    />
  );
}

// ============================================================
// TEAM SWATCH (color dot)
// ============================================================

function TeamSwatch({ team, size = 10 }) {
  const data = TEAM_DATA[team];
  if (!data) return null;
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: data.color, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)', flexShrink: 0,
    }} />
  );
}

// ============================================================
// TEAM PICKER (searchable select styled as a card)
// ============================================================

const ALL_TEAMS = Object.keys(TEAM_DATA).sort();

function TeamPicker({ value, onChange, align = 'left' }) {
  const data = TEAM_DATA[value];
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-start' : 'flex-end',
      gap: 10, flex: 1, minWidth: 0,
    }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 220 }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%', appearance: 'none', WebkitAppearance: 'none',
            background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10,
            color: COLORS.ink, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15,
            padding: '10px 32px 10px 14px', cursor: 'pointer',
            textAlign: align,
          }}
        >
          {ALL_TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', color: COLORS.inkFaint, fontSize: 11,
        }}>▾</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: align === 'left' ? 'row' : 'row-reverse' }}>
        <Flag team={value} size={22} />
        <span style={{ fontSize: 11, color: COLORS.inkSoft, fontFamily: FONT_MONO }}>
          Elo {data ? Math.round(data.elo) : '—'}
        </span>
      </div>
    </div>
  );
}

function FormModeToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={() => onToggle(v => !v)}
      style={{
        background: enabled ? COLORS.ink : '#FFFFFF',
        color: enabled ? '#FFFFFF' : COLORS.inkSoft,
        border: `1px solid ${enabled ? COLORS.ink : COLORS.borderStrong}`,
        borderRadius: 999,
        padding: '7px 12px',
        fontSize: 11.5,
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {enabled ? 'Use tournament results' : 'Use baseline model'}
    </button>
  );
}

// ============================================================
// TAB BAR
// ============================================================

function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'predictor', label: 'Predictor' },
    { id: 'results', label: 'Results' },
    { id: 'tables', label: 'Championship' },
    { id: 'bracket', label: 'Bracket' },
  ];
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 4, background: COLORS.surface, borderRadius: 12, padding: 4,
      marginBottom: 20,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: '1 1 110px', padding: '9px 10px', borderRadius: 9, border: 'none',
            background: active === tab.id ? '#FFFFFF' : 'transparent',
            color: active === tab.id ? COLORS.ink : COLORS.inkSoft,
            fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13,
            cursor: 'pointer', boxShadow: active === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease', whiteSpace: 'nowrap',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// SCREEN 1: MATCH PREDICTOR
// ============================================================

function OutcomeBar({ result }) {
  const { home, away, pHome, pDraw, pAway } = result;
  const homeColor = TEAM_DATA[home].color;
  const awayColor = TEAM_DATA[away].color;
  const hPct = pHome * 100, dPct = pDraw * 100, aPct = pAway * 100;

  return (
    <div>
      <div style={{ display: 'flex', height: 40, borderRadius: 8, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <div style={{
          width: `${hPct}%`, background: homeColor, display: 'flex',
          alignItems: 'center', justifyContent: 'center', transition: 'width 0.5s ease',
        }}>
          {hPct > 14 && <span style={{ fontSize: 13, fontWeight: 700, color: contrastTextColor(homeColor), fontFamily: FONT_MONO }}>{hPct.toFixed(0)}%</span>}
        </div>
        <div style={{
          width: `${dPct}%`, background: '#D4D1CB', display: 'flex',
          alignItems: 'center', justifyContent: 'center', transition: 'width 0.5s ease',
        }}>
          {dPct > 14 && <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, fontFamily: FONT_MONO }}>{dPct.toFixed(0)}%</span>}
        </div>
        <div style={{
          width: `${aPct}%`, background: awayColor, display: 'flex',
          alignItems: 'center', justifyContent: 'center', transition: 'width 0.5s ease',
        }}>
          {aPct > 14 && <span style={{ fontSize: 13, fontWeight: 700, color: contrastTextColor(awayColor), fontFamily: FONT_MONO }}>{aPct.toFixed(0)}%</span>}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: COLORS.inkSoft }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <TeamSwatch team={home} size={8} /> {home} win {hPct <= 14 ? `· ${hPct.toFixed(0)}%` : ''}
        </span>
        <span>Draw {dPct <= 14 ? `· ${dPct.toFixed(0)}%` : ''}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {away} win {aPct <= 14 ? `· ${aPct.toFixed(0)}%` : ''} <TeamSwatch team={away} size={8} />
        </span>
      </div>
    </div>
  );
}

function ScoreGrid({ result }) {
  const { home, away, scoreGrid, mostLikely } = result;
  const homeColor = TEAM_DATA[home].color;
  const awayColor = TEAM_DATA[away].color;
  let maxP = 0;
  scoreGrid.forEach(row => row.forEach(p => { if (p > maxP) maxP = p; }));

  // Blend: home color tints rows where home is ahead, away color where away is ahead, neutral on draws
  function cellColor(h, a, p) {
    const t = maxP > 0 ? p / maxP : 0;
    let base;
    if (h > a) base = homeColor;
    else if (a > h) base = awayColor;
    else base = '#8C8A85';
    return mixWithWhite(base, 1 - t * 0.85);
  }

  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.inkSoft, marginBottom: 10, fontWeight: 600 }}>
        Scoreline probability
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 26 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Flag team={away} size={14} />
          <span style={{ fontSize: 11, color: COLORS.inkSoft }}>{away} goals →</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 2 }}>
          <Flag team={home} size={14} />
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `24px repeat(${MAX_GOALS + 1}, 1fr)`, gap: 3 }}>
          <div />
          {Array.from({ length: MAX_GOALS + 1 }).map((_, a) => (
            <div key={a} style={{ textAlign: 'center', fontSize: 11, color: COLORS.inkFaint, fontWeight: 700, fontFamily: FONT_MONO }}>{a}</div>
          ))}
          {scoreGrid.map((row, h) => (
            <React.Fragment key={h}>
              <div style={{ textAlign: 'center', fontSize: 11, color: COLORS.inkFaint, fontWeight: 700, alignSelf: 'center', fontFamily: FONT_MONO }}>{h}</div>
              {row.map((p, a) => {
                const isPeak = h === mostLikely.h && a === mostLikely.a;
                return (
                  <div key={a} style={{
                    background: cellColor(h, a, p), borderRadius: 5, padding: '6px 2px',
                    textAlign: 'center', fontSize: 10.5, fontWeight: isPeak ? 800 : 500,
                    color: (p / maxP) > 0.5 ? contrastTextColor(h > a ? homeColor : a > h ? awayColor : '#8C8A85') : COLORS.inkSoft,
                    fontFamily: FONT_MONO,
                    outline: isPeak ? `1.5px solid ${COLORS.ink}` : 'none',
                  }}>
                    {(p * 100).toFixed(1)}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${COLORS.border}` }}>
      <span style={{ fontSize: 13, color: COLORS.inkSoft }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, fontFamily: FONT_MONO }}>{value}</span>
    </div>
  );
}

function MatchPredictorScreen({ formState, useLiveForm }) {
  const [homeTeam, setHomeTeam] = React.useState('Argentina');
  const [awayTeam, setAwayTeam] = React.useState('France');
  const [neutral, setNeutral] = React.useState(true);

  const result = React.useMemo(
    () => predictMatch(homeTeam, awayTeam, neutral, useLiveForm ? formState : null),
    [homeTeam, awayTeam, neutral, formState, useLiveForm]
  );
  const homeColor = TEAM_DATA[homeTeam].color;
  const awayColor = TEAM_DATA[awayTeam].color;
  const homeForm = formState[homeTeam];
  const awayForm = formState[awayTeam];

  const swap = () => { setHomeTeam(awayTeam); setAwayTeam(homeTeam); };

  return (
    <div>
      {/* Header card with team pickers + projected score, gradient split by team colors */}
      <div style={{
        borderRadius: 16, padding: '24px 20px', marginBottom: 20, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${mixWithWhite(homeColor, 0.88)} 0%, #FFFFFF 50%, ${mixWithWhite(awayColor, 0.88)} 100%)`,
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <TeamPicker value={homeTeam} onChange={setHomeTeam} align="left" />
          <button
            onClick={swap}
            aria-label="Swap teams"
            style={{
              background: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: '50%',
              width: 34, height: 34, color: COLORS.inkSoft, fontSize: 14, cursor: 'pointer',
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 10, boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            }}
          >⇄</button>
          <TeamPicker value={awayTeam} onChange={setAwayTeam} align="right" />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 16, marginTop: 24 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 44, fontWeight: 800, color: COLORS.ink }}>{result.expectedScore.h}</span>
          <span style={{ fontSize: 14, color: COLORS.inkFaint }}>–</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 44, fontWeight: 800, color: COLORS.ink }}>{result.expectedScore.a}</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: COLORS.inkSoft, marginTop: 2 }}>
          projected scoreline · {result.lamHome.toFixed(2)}–{result.lamAway.toFixed(2)} expected goals
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: COLORS.inkFaint, marginTop: 8 }}>
          {useLiveForm
            ? 'Includes an adjustment layer from entered tournament results.'
            : 'Using the baked baseline model only.'}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
          <button
            onClick={() => setNeutral(n => !n)}
            style={{
              background: neutral ? '#FFFFFF' : COLORS.ink,
              border: `1px solid ${COLORS.borderStrong}`, borderRadius: 20,
              padding: '6px 14px', fontSize: 11, letterSpacing: '0.03em',
              color: neutral ? COLORS.inkSoft : '#FFFFFF', cursor: 'pointer', fontWeight: 600,
            }}
          >
            {neutral ? 'Neutral venue' : `Home advantage: ${homeTeam}`}
          </button>
        </div>
      </div>

      {/* Stats body */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.inkSoft, marginBottom: 10, fontWeight: 600 }}>
            Match outcome
          </div>
          <OutcomeBar result={result} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <ScoreGrid result={result} />
          <div style={{ fontSize: 11, color: COLORS.inkFaint, marginTop: 8 }}>
            Single most-likely exact score: {result.mostLikely.h}-{result.mostLikely.a} ({(result.mostLikely.p * 100).toFixed(1)}% — no individual score is ever very likely)
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.inkSoft, marginBottom: 4, fontWeight: 600 }}>
            Match stats
          </div>
          <StatRow label="Over 2.5 total goals" value={`${(result.over25 * 100).toFixed(0)}%`} />
          <StatRow label="Both teams to score" value={`${(result.btts * 100).toFixed(0)}%`} />
          <StatRow label={`${homeTeam} Elo`} value={Math.round(result.eloH)} />
          <StatRow label={`${awayTeam} Elo`} value={Math.round(result.eloA)} />
          {useLiveForm && (
            <StatRow
              label={`${homeTeam} tournament results`}
              value={homeForm ? `${homeForm.matches} matches · ${result.eloH >= result.baseEloHome ? '+' : ''}${(result.eloH - result.baseEloHome).toFixed(0)} Elo` : 'No World Cup sample yet'}
            />
          )}
          {useLiveForm && (
            <StatRow
              label={`${awayTeam} tournament results`}
              value={awayForm ? `${awayForm.matches} matches · ${result.eloA >= result.baseEloAway ? '+' : ''}${(result.eloA - result.baseEloAway).toFixed(0)} Elo` : 'No World Cup sample yet'}
            />
          )}
        </div>

        <div style={{ marginTop: 18, fontSize: 11, color: COLORS.inkFaint, lineHeight: 1.5 }}>
          Built from baked Elo ratings and a Poisson attack/defense model, with an optional tournament-results adjustment layer on top. Estimates, not guarantees.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: RESULTS (day-by-day score entry)
// ============================================================

function ScoreInput({ value, onChange, align }) {
  return (
    <input
      type="number"
      min="0"
      max="20"
      inputMode="numeric"
      value={value === null || value === undefined ? '' : value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="–"
      style={{
        width: 38, height: 34, textAlign: 'center', borderRadius: 8,
        border: `1.5px solid ${COLORS.border}`, fontFamily: FONT_MONO, fontSize: 15,
        fontWeight: 700, color: COLORS.ink, background: '#FFFFFF',
        WebkitAppearance: 'none', MozAppearance: 'textfield',
      }}
    />
  );
}

function FixtureRow({ fixture, index, updateScore }) {
  const data_h = TEAM_DATA[fixture.home];
  const data_a = TEAM_DATA[fixture.away];
  const isPlayed = fixture.hs !== null && fixture.hs !== undefined;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px',
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', minWidth: 0 }}>
        <span style={{
          fontSize: 13, fontWeight: isPlayed ? 600 : 500, color: COLORS.ink,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {fixture.home}
        </span>
        <Flag team={fixture.home} size={18} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <ScoreInput value={fixture.hs} onChange={(v) => updateScore(index, 'hs', v)} />
        <span style={{ color: COLORS.inkFaint, fontSize: 13 }}>–</span>
        <ScoreInput value={fixture.aw} onChange={(v) => updateScore(index, 'aw', v)} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <Flag team={fixture.away} size={18} />
        <span style={{
          fontSize: 13, fontWeight: isPlayed ? 600 : 500, color: COLORS.ink,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {fixture.away}
        </span>
      </div>
    </div>
  );
}

function ResultsScreen({ fixtures, updateScore, playedCount, onReset, onSavePermanently, knockoutScores, updateKnockoutScore, setKnockoutPenaltyWinner }) {
  // Group fixtures by date in chronological order
  const byDate = React.useMemo(() => {
    const map = {};
    fixtures.forEach((f, i) => {
      if (!map[f.date]) map[f.date] = [];
      map[f.date].push({ fixture: f, index: i });
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [fixtures]);

  // Build group lookup for the group-letter badge
  const groupOf = React.useMemo(() => {
    const m = {};
    WC_GROUPS.forEach((g, gi) => g.forEach(t => { m[t] = WC_GROUP_LABELS[gi]; }));
    return m;
  }, []);

  const liveBracket = React.useMemo(
    () => buildRealKnockoutBracket(fixtures, knockoutScores),
    [fixtures, knockoutScores]
  );

  return (
    <div>
      <div style={{
        background: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: 16,
        padding: 20, marginBottom: 16, display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink }}>Results</div>
          <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2, maxWidth: 520 }}>
            {playedCount} of {fixtures.length} group games played. Edit any score and the Championship and Bracket tabs update immediately. Edits are saved and shared with anyone who opens this — use it to walk the model forward day by day as real results come in, including the knockout rounds below once they're reachable.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          <button
            onClick={onReset}
            style={{
              background: 'transparent', border: `1px solid ${COLORS.borderStrong}`, borderRadius: 10,
              padding: '8px 14px', fontSize: 12, fontWeight: 600, color: COLORS.inkSoft,
              cursor: 'pointer',
            }}
          >
            Reset to actual results
          </button>
          <button
            onClick={onSavePermanently}
            style={{
              background: COLORS.ink, border: `1px solid ${COLORS.ink}`, borderRadius: 10,
              padding: '8px 14px', fontSize: 12, fontWeight: 600, color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            Save permanently
          </button>
        </div>
      </div>

      <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.inkFaint, fontWeight: 700, marginBottom: 8, paddingLeft: 4 }}>
        Group stage
      </div>

      {byDate.map(([date, rows]) => (
        <div key={date} style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.inkFaint,
            fontWeight: 700, marginBottom: 8, paddingLeft: 4,
          }}>
            {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <div style={{ background: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '4px 14px' }}>
            {rows.map(({ fixture, index }) => (
              <FixtureRow key={index} fixture={fixture} index={index} updateScore={updateScore} />
            ))}
          </div>
        </div>
      ))}

      <div style={{ fontSize: 11, color: COLORS.inkFaint, lineHeight: 1.5, marginBottom: 24 }}>
        Scores shown are seeded from actual results where available. Clearing a score (leaving it blank) returns that match to "not yet played," and the simulator will project it instead. "Reset to actual results" undoes unsaved edits but keeps anything saved permanently; "Save permanently" locks the current results in so they survive a reset for everyone.
      </div>

      <KnockoutResultsSection
        liveBracket={liveBracket}
        knockoutScores={knockoutScores}
        updateKnockoutScore={updateKnockoutScore}
        setKnockoutPenaltyWinner={setKnockoutPenaltyWinner}
      />
    </div>
  );
}

const KNOCKOUT_STAGE_LABELS = {
  r32: 'Round of 32 (matches 73–88)',
  r16: 'Round of 16 (matches 89–96)',
  qf: 'Quarterfinals (matches 97–100)',
  sf: 'Semifinals (matches 101–102)',
  third_place: 'Third place playoff (match 103)',
  final: 'Final (match 104)',
};

function KnockoutScoreRow({ matchId, teams, score, onChangeScore, onSetPenaltyWinner }) {
  const [teamA, teamB] = teams || [null, null];
  const bothKnown = teamA && teamB;
  const hs = score ? score.hs : null;
  const aw = score ? score.aw : null;
  const isTied = hs !== null && aw !== null && hs === aw;
  const pen = score ? score.pen : undefined;

  if (!bothKnown) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px',
        borderBottom: `1px solid ${COLORS.border}`, color: COLORS.inkFaint, fontSize: 12.5,
      }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, width: 28 }}>#{matchId}</span>
        <span>Not yet determined — depends on earlier results</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px 4px', borderBottom: `1px solid ${COLORS.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkFaint, width: 24 }}>#{matchId}</span>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teamA}</span>
          <Flag team={teamA} size={18} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <ScoreInput value={hs} onChange={(v) => onChangeScore('hs', v)} />
          <span style={{ color: COLORS.inkFaint, fontSize: 13 }}>–</span>
          <ScoreInput value={aw} onChange={(v) => onChangeScore('aw', v)} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <Flag team={teamB} size={18} />
          <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teamB}</span>
        </div>
      </div>
      {isTied && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, paddingLeft: 34, fontSize: 11.5, color: COLORS.inkSoft }}>
          <span>Level after 90 — winner on penalties:</span>
          <button
            onClick={() => onSetPenaltyWinner('home')}
            style={{
              padding: '3px 10px', borderRadius: 6, fontSize: 11.5, cursor: 'pointer',
              border: `1px solid ${pen === 'home' ? COLORS.ink : COLORS.borderStrong}`,
              background: pen === 'home' ? COLORS.ink : 'transparent',
              color: pen === 'home' ? '#FFFFFF' : COLORS.inkSoft, fontWeight: 600,
            }}
          >
            {teamA}
          </button>
          <button
            onClick={() => onSetPenaltyWinner('away')}
            style={{
              padding: '3px 10px', borderRadius: 6, fontSize: 11.5, cursor: 'pointer',
              border: `1px solid ${pen === 'away' ? COLORS.ink : COLORS.borderStrong}`,
              background: pen === 'away' ? COLORS.ink : 'transparent',
              color: pen === 'away' ? '#FFFFFF' : COLORS.inkSoft, fontWeight: 600,
            }}
          >
            {teamB}
          </button>
        </div>
      )}
    </div>
  );
}

function KnockoutResultsSection({ liveBracket, knockoutScores, updateKnockoutScore, setKnockoutPenaltyWinner }) {
  if (!liveBracket.allGroupsComplete) {
    return (
      <div style={{
        background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
        padding: 20, textAlign: 'center', color: COLORS.inkSoft, fontSize: 13,
      }}>
        Knockout-round score entry unlocks once the group stage finishes — FIFA's Round of 32 matchups
        (and which third-place teams qualify) aren't determined until all 72 group games are played.
      </div>
    );
  }

  const stageOrder = ['r32', 'r16', 'qf', 'sf', 'third_place', 'final'];

  return (
    <div>
      {stageOrder.map(stage => {
        const matchIds = Object.keys(KNOCKOUT_STRUCTURE[stage]);
        return (
          <div key={stage} style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.inkFaint,
              fontWeight: 700, marginBottom: 8, paddingLeft: 4,
            }}>
              {KNOCKOUT_STAGE_LABELS[stage]}
            </div>
            <div style={{ background: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '4px 14px' }}>
              {matchIds.map(matchId => (
                <KnockoutScoreRow
                  key={matchId}
                  matchId={matchId}
                  teams={liveBracket.teamOf[matchId]}
                  score={knockoutScores[matchId]}
                  onChangeScore={(field, value) => updateKnockoutScore(matchId, field, value)}
                  onSetPenaltyWinner={(side) => setKnockoutPenaltyWinner(matchId, side)}
                />
              ))}
            </div>
          </div>
        );
      })}
      <div style={{ fontSize: 11, color: COLORS.inkFaint, lineHeight: 1.5 }}>
        Later rounds stay "not yet determined" until the matches that feed them are entered. Knockout games can't end in a draw — if a score is level, pick the penalty-shootout winner to advance them.
      </div>
    </div>
  );
}

// ============================================================
// SCREEN 2: CHAMPIONSHIP & GROUP TABLES
// ============================================================

function ChampionshipRow({ rank, row, maxChampion }) {
  const data = TEAM_DATA[row.team];
  const barWidth = maxChampion > 0 ? (row.champion / maxChampion) * 100 : 0;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px',
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
      <span style={{ width: 20, fontSize: 12, color: COLORS.inkFaint, fontFamily: FONT_MONO, textAlign: 'right' }}>{rank}</span>
      <Flag team={row.team} size={20} />
      <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink, width: 130, flexShrink: 0 }}>{row.team}</span>
      <div style={{ flex: 1, position: 'relative', height: 18, background: COLORS.surface, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          width: `${barWidth}%`, height: '100%', background: data.color,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{ width: 52, textAlign: 'right', fontSize: 13, fontWeight: 700, color: COLORS.ink, fontFamily: FONT_MONO }}>
        {row.champion.toFixed(1)}%
      </span>
    </div>
  );
}

// Compute actual current standings for one group from played fixtures only
// (unplayed matches simply don't contribute yet — this is "real table as of now").
function computeActualStandings(groupTeams, fixtures) {
  const table = {};
  groupTeams.forEach(t => { table[t] = { pts: 0, gf: 0, ga: 0, gd: 0, played: 0 }; });
  fixtures.forEach(m => {
    if (!(m.home in table)) return; // not this group
    if (m.hs === null || m.hs === undefined || m.aw === null || m.aw === undefined) return; // not played
    table[m.home].gf += m.hs; table[m.home].ga += m.aw; table[m.home].played++;
    table[m.away].gf += m.aw; table[m.away].ga += m.hs; table[m.away].played++;
    if (m.hs > m.aw) table[m.home].pts += 3;
    else if (m.hs < m.aw) table[m.away].pts += 3;
    else { table[m.home].pts += 1; table[m.away].pts += 1; }
  });
  groupTeams.forEach(t => { table[t].gd = table[t].gf - table[t].ga; });
  const ranked = [...groupTeams].sort((a, b) => {
    if (table[b].pts !== table[a].pts) return table[b].pts - table[a].pts;
    if (table[b].gd !== table[a].gd) return table[b].gd - table[a].gd;
    return table[b].gf - table[a].gf;
  });
  return { table, ranked };
}

function GroupTable({ groupTeams, groupLabel, simResults, fixtures }) {
  const { table, ranked } = computeActualStandings(groupTeams, fixtures);
  const simByTeam = {};
  simResults.forEach(r => { simByTeam[r.team] = r; });

  return (
    <div style={{ background: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 14, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.inkSoft, fontWeight: 700 }}>
          Group {groupLabel}
        </span>
        <span style={{ fontSize: 10, color: COLORS.inkFaint, fontFamily: FONT_MONO }}>P · PTS · GD · ADV%</span>
      </div>
      {ranked.map((t, i) => {
        const row = table[t];
        const sim = simByTeam[t];
        return (
          <div key={t} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
            borderBottom: i < ranked.length - 1 ? `1px solid ${COLORS.border}` : 'none',
          }}>
            <Flag team={t} size={16} />
            <span style={{ fontSize: 12.5, fontWeight: i < 2 ? 700 : 500, color: i < 2 ? COLORS.ink : COLORS.inkSoft, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {t}
            </span>
            <span style={{ fontSize: 10.5, fontFamily: FONT_MONO, color: COLORS.inkFaint, width: 16, textAlign: 'right' }}>
              {row.played}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: FONT_MONO, color: COLORS.ink, width: 20, textAlign: 'right' }}>
              {row.pts}
            </span>
            <span style={{ fontSize: 10.5, fontFamily: FONT_MONO, color: COLORS.inkFaint, width: 26, textAlign: 'right' }}>
              {row.gd > 0 ? `+${row.gd}` : row.gd}
            </span>
            <span style={{ fontSize: 11, fontFamily: FONT_MONO, color: COLORS.inkSoft, width: 34, textAlign: 'right' }}>
              {sim ? sim.r32.toFixed(0) : '–'}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ChampionshipScreen({ fixtures, playedCount, knockoutScores, formState, useLiveForm }) {
  const [simResults, setSimResults] = React.useState(null);
  const [running, setRunning] = React.useState(false);
  const [nSims, setNSims] = React.useState(3000);

  const runSimulation = React.useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      const seed = Math.floor(Math.random() * 1e9);
      const results = runMonteCarlo(nSims, seed, fixtures, knockoutScores, useLiveForm ? formState : null);
      setSimResults(results);
      setRunning(false);
    }, 50);
  }, [nSims, fixtures, knockoutScores, formState, useLiveForm]);

  // Re-run automatically whenever the underlying fixtures change (e.g. a score
  // was edited on the Results tab), not just on first mount.
  React.useEffect(() => { runSimulation(); }, [fixtures, knockoutScores, useLiveForm]);

  if (!simResults) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: COLORS.inkSoft }}>
        Running {nSims.toLocaleString()} simulations…
      </div>
    );
  }

  const maxChampion = Math.max(...simResults.map(r => r.champion));
  const groupLabels = WC_GROUP_LABELS;

  return (
    <div>
      <div style={{
        background: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: 16,
        padding: 20, marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink }}>Championship odds</div>
            <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2 }}>
              From {nSims.toLocaleString()} simulated tournaments, already reflecting {playedCount} of {fixtures.length} games played. Re-roll for a fresh random batch.
            </div>
            <div style={{ fontSize: 11, color: COLORS.inkFaint, marginTop: 6 }}>
              {useLiveForm ? 'Tournament-results adjustments are currently included in every future simulated match.' : 'These odds are using the baked baseline model only.'}
            </div>
          </div>
          <button
            onClick={runSimulation}
            disabled={running}
            style={{
              background: COLORS.ink, color: '#FFFFFF', border: 'none', borderRadius: 10,
              padding: '9px 16px', fontSize: 12.5, fontWeight: 700, cursor: running ? 'default' : 'pointer',
              opacity: running ? 0.6 : 1,
            }}
          >
            {running ? 'Simulating…' : 'Roll new simulation'}
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          {simResults.slice(0, 12).map((row, i) => (
            <ChampionshipRow key={row.team} rank={i + 1} row={row} maxChampion={maxChampion} />
          ))}
        </div>
      </div>

      <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.inkSoft, fontWeight: 700, marginBottom: 12 }}>
        Group standings — ranked by actual results, played · goal diff · advance odds
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12,
      }}>
        {WC_GROUPS.map((g, i) => (
          <GroupTable key={i} groupTeams={g} groupLabel={groupLabels[i]} simResults={simResults} fixtures={fixtures} />
        ))}
      </div>

      <div style={{ marginTop: 18, fontSize: 11, color: COLORS.inkFaint, lineHeight: 1.5 }}>
        Teams are ranked by actual current standing (points → goal difference → goals scored) for games already played; remaining games are projected by the model. The right-hand percentage is each team's simulated chance of advancing past the group stage. Edit scores on the Results tab to update this as the tournament unfolds.
      </div>
    </div>
  );
}

// ============================================================
// SCREEN 3 (REBUILT): BRACKET — connected tree, real FIFA structure
// ============================================================

const STAGE_ORDER = ['r32', 'r16', 'qf', 'sf', 'final'];
const STAGE_TITLES = { r32: 'Round of 32', r16: 'Round of 16', qf: 'Quarterfinals', sf: 'Semifinals', final: 'Final' };

// Build an ordered list of match IDs per stage, arranged so that matches
// feeding the same next-round match sit adjacent to each other -- this is
// what makes the connecting lines readable. We derive r32's order by
// walking forward from the final and recursively expanding each match's
// two inputs, then derive each later stage's order by pairing up the
// previous stage's order two at a time and finding which match consumes them.
function buildBracketOrder() {
  function expandR32(matchId, stage) {
    if (stage === 'r32') return [matchId];
    const slots = KNOCKOUT_STRUCTURE[stage][matchId];
    const inputs = slots.filter(([kind]) => kind === 'W').map(([, ref]) => String(ref));
    if (inputs.length !== 2) return [matchId];
    const prevStage = STAGE_ORDER[STAGE_ORDER.indexOf(stage) - 1];
    return [...expandR32(inputs[0], prevStage), ...expandR32(inputs[1], prevStage)];
  }
  const finalId = Object.keys(KNOCKOUT_STRUCTURE.final)[0];
  const order = { r32: expandR32(finalId, 'final') };

  function nextStageOrder(prevOrder, stage) {
    const result = [];
    const matches = KNOCKOUT_STRUCTURE[stage];
    for (let i = 0; i < prevOrder.length; i += 2) {
      const a = prevOrder[i], b = prevOrder[i + 1];
      const matchId = Object.keys(matches).find(id => {
        const inputs = matches[id].filter(([k]) => k === 'W').map(([, r]) => String(r));
        return (inputs[0] === a && inputs[1] === b) || (inputs[0] === b && inputs[1] === a);
      });
      if (matchId) result.push(matchId);
    }
    return result;
  }
  order.r16 = nextStageOrder(order.r32, 'r16');
  order.qf = nextStageOrder(order.r16, 'qf');
  order.sf = nextStageOrder(order.qf, 'sf');
  order.final = nextStageOrder(order.sf, 'final');
  return order;
}

const BRACKET_ORDER = buildBracketOrder();

function TeamLine({ team, isWinner }) {
  if (!team) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px',
        fontSize: 11.5, color: COLORS.inkFaint, height: 24,
      }}>
        <span style={{ width: 14, height: 10, background: COLORS.surface, borderRadius: 2, flexShrink: 0 }} />
        TBD
      </div>
    );
  }
  const data = TEAM_DATA[team];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px',
      background: isWinner ? mixWithWhite(data.color, 0.85) : 'transparent',
      fontSize: 11.5, fontWeight: isWinner ? 700 : 500, color: COLORS.ink, height: 24,
      borderRadius: 4,
    }}>
      <Flag team={team} size={13} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team}</span>
    </div>
  );
}

function MatchCard({ teams, winner }) {
  const [teamA, teamB] = teams || [null, null];
  return (
    <div style={{
      border: `1px solid ${COLORS.border}`, borderRadius: 8, width: 150,
      background: '#FFFFFF', overflow: 'hidden',
    }}>
      <TeamLine team={teamA} isWinner={winner && winner === teamA} />
      <div style={{ borderTop: `1px solid ${COLORS.border}` }} />
      <TeamLine team={teamB} isWinner={winner && winner === teamB} />
    </div>
  );
}

// Connector: an SVG bracket "elbow" linking two cards on the left to one on the right.
function BracketConnector({ height }) {
  const midY = height / 2;
  return (
    <svg width="28" height={height} style={{ flexShrink: 0, display: 'block' }}>
      <path
        d={`M 0 ${height * 0.25} H 14 V ${height * 0.75} H 0`}
        fill="none" stroke={COLORS.borderStrong} strokeWidth="1.5"
      />
      <line x1="14" y1={midY} x2="28" y2={midY} stroke={COLORS.borderStrong} strokeWidth="1.5" />
    </svg>
  );
}

function BracketTree({ sim, isSimulated }) {
  const cardHeight = 58;
  const gapBase = 14;

  return (
    <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
      {STAGE_ORDER.map((stage, stageIdx) => {
        const matchIds = BRACKET_ORDER[stage];
        const gap = gapBase * Math.pow(2, stageIdx) + cardHeight * (Math.pow(2, stageIdx) - 1);
        return (
          <div key={stage} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.inkFaint,
                fontWeight: 700, textAlign: 'center', marginBottom: 10,
              }}>
                {STAGE_TITLES[stage]}
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1,
                gap: `${gap}px`,
              }}>
                {matchIds.map(matchId => {
                  const winner = isSimulated ? sim.winners[matchId] : (sim.winnerOf ? sim.winnerOf(matchId) : null);
                  return (
                    <MatchCard
                      key={matchId}
                      teams={sim.teamOf[matchId]}
                      winner={winner}
                    />
                  );
                })}
              </div>
            </div>
            {stageIdx < STAGE_ORDER.length - 1 && (
              <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                gap: `${gap}px`, paddingTop: 28,
              }}>
                {Array.from({ length: matchIds.length / 2 }).map((_, i) => (
                  <BracketConnector key={i} height={cardHeight + gap} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ThirdPlaceCard({ sim, isSimulated }) {
  const teams = sim.teamOf['103'];
  const winner = isSimulated ? sim.winners['103'] : (sim.winnerOf ? sim.winnerOf('103') : null);
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.inkFaint, fontWeight: 700, marginBottom: 8 }}>
        Third place playoff
      </div>
      <MatchCard teams={teams} winner={winner} />
    </div>
  );
}

function BracketScreen({ fixtures, playedCount, knockoutScores, formState, useLiveForm }) {
  const [seed, setSeed] = React.useState(() => Math.floor(Math.random() * 1e9));

  const liveBracket = React.useMemo(() => buildRealKnockoutBracket(fixtures, knockoutScores), [fixtures, knockoutScores]);
  const simBracket = React.useMemo(() => {
    const rng = mulberry32(seed);
    return simulateRealBracket(fixtures, knockoutScores, rng, useLiveForm ? formState : null);
  }, [seed, fixtures, knockoutScores, formState, useLiveForm]);
  const displayBracket = React.useMemo(
    () => buildDisplayBracket(liveBracket, simBracket),
    [liveBracket, simBracket]
  );

  const regenerate = () => setSeed(Math.floor(Math.random() * 1e9));

  const groupStageDone = liveBracket.allGroupsComplete;
  const lockedSlots = Object.values(liveBracket.teamOf).flat().filter(Boolean).length;
  const projectedSlots = Object.values(displayBracket.teamOf).flat().filter(Boolean).length - lockedSlots;

  return (
    <div>
      <div style={{
        background: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20, marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink }}>Live bracket</div>
          <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2, maxWidth: 480 }}>
            {groupStageDone
              ? 'Group stage complete — Round of 32 matchups below are locked from the actual standings. Enter knockout scores on the Results tab and the later rounds will advance with real teams immediately.'
              : `Group stage in progress (${playedCount} of ${fixtures.length} games played). Current group leaders and runners-up already occupy their FIFA bracket slots; unresolved third-place paths and later rounds stay projected.`}
          </div>
          <div style={{ fontSize: 11, color: COLORS.inkFaint, marginTop: 6, maxWidth: 520 }}>
            {useLiveForm ? 'Projected branches also include tournament-results adjustments from entered scores.' : 'Projected branches are using the baked baseline model only.'}
          </div>
        </div>
        <button
          onClick={regenerate}
          style={{
            background: COLORS.ink, color: '#FFFFFF', border: 'none', borderRadius: 10,
            padding: '9px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
          }}
        >
          Simulate another run
        </button>
      </div>

      <div style={{ fontSize: 11, color: COLORS.inkFaint, lineHeight: 1.5, marginBottom: 18 }}>
        {lockedSlots} bracket slots are currently driven by entered results and live standings; {Math.max(projectedSlots, 0)} still rely on the simulation path.
      </div>

      {displayBracket.champion && (
        <div style={{
          background: mixWithWhite(TEAM_DATA[displayBracket.champion].color, 0.88),
          border: `1.5px solid ${TEAM_DATA[displayBracket.champion].color}`,
          borderRadius: 16, padding: '18px 20px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center',
        }}>
          <Flag team={displayBracket.champion} size={34} />
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.inkSoft, fontWeight: 700 }}>
              {liveBracket.winnerOf && liveBracket.winnerOf('104') ? 'Champion' : 'Current projected champion'}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.ink }}>{displayBracket.champion}</div>
          </div>
        </div>
      )}

      <div style={{
        background: '#FFFFFF', border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20,
      }}>
        <BracketTree sim={displayBracket} isSimulated={true} />
        <ThirdPlaceCard sim={displayBracket} isSimulated={true} />
      </div>

      <div style={{ marginTop: 18, fontSize: 11, color: COLORS.inkFaint, lineHeight: 1.5 }}>
        Round of 32 pairings follow FIFA's actual fixed bracket (tournament regulations Annex C) — group winners and runners-up have permanent slots, and the eight qualifying third-place teams are slotted using FIFA's official 495-combination table. This view now blends real tournament state with projections: entered group and knockout results lock teams into place immediately, while unresolved paths are filled by the Elo-based simulation until the real outcomes arrive. Check the Championship tab for odds aggregated across thousands of runs rather than any single bracket.
      </div>
    </div>
  );
}

// ============================================================
// PERSISTENT SHARED STORAGE FOR RESULTS
// Two tiers:
//   - editable ("score:" / "knockout:")            -- cleared by Reset
//   - permanent ("permanent:score:" / "permanent:knockout:") -- only ever
//     written via the Save permanently button; Reset
//     never touches this tier.
// Effective state on load = seed data, overlaid with permanent saves,
// overlaid with editable saves. Reset clears the editable tier only, so
// the visible result falls back to permanent saves (if any) or seed data.
// ============================================================

function fixtureKey(m) {
  return `score:${m.date}:${m.home}__${m.away}`;
}
function permanentFixtureKey(m) {
  return `permanent:score:${m.date}:${m.home}__${m.away}`;
}
function knockoutKey(matchId) {
  return `knockout:${matchId}`;
}
function permanentKnockoutKey(matchId) {
  return `permanent:knockout:${matchId}`;
}

function getStorageApi() {
  if (supabase) {
    return {
      async set(key, value) {
        const { error } = await supabase
          .from(APP_STATE_TABLE)
          .upsert({ key, value: JSON.parse(value) }, { onConflict: 'key' });
        if (error) throw error;
        return { ok: true };
      },
      async get(key) {
        const { data, error } = await supabase
          .from(APP_STATE_TABLE)
          .select('value')
          .eq('key', key)
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error(`Missing key: ${key}`);
        return { value: JSON.stringify(data.value) };
      },
      async list(prefix) {
        const { data, error } = await supabase
          .from(APP_STATE_TABLE)
          .select('key')
          .like('key', `${prefix}%`);
        if (error) throw error;
        return { keys: (data || []).map((row) => row.key) };
      },
      async delete(key) {
        const { error } = await supabase
          .from(APP_STATE_TABLE)
          .delete()
          .eq('key', key);
        if (error) throw error;
        return { ok: true };
      },
    };
  }

  if (typeof window !== 'undefined' && window.storage) {
    return window.storage;
  }

  return {
    async set(key, value) {
      window.localStorage.setItem(key, value);
      return { ok: true };
    },
    async get(key) {
      const value = window.localStorage.getItem(key);
      if (value === null) {
        throw new Error(`Missing key: ${key}`);
      }
      return { value };
    },
    async list(prefix) {
      const keys = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(prefix)) keys.push(key);
      }
      return { keys };
    },
    async delete(key) {
      window.localStorage.removeItem(key);
      return { ok: true };
    },
  };
}

const storage = getStorageApi();

async function saveFixtureEdit(m) {
  try {
    await storage.set(fixtureKey(m), JSON.stringify({ hs: m.hs, aw: m.aw }), true);
  } catch (e) { console.error('Could not save result:', e); }
}
async function saveKnockoutEdit(matchId, score) {
  try {
    await storage.set(knockoutKey(matchId), JSON.stringify(score), true);
  } catch (e) { console.error('Could not save knockout result:', e); }
}

// Generic loader: reads every key under a prefix and applies it via `apply`.
async function loadKeyed(prefix, apply) {
  try {
    const list = await storage.list(prefix, true);
    if (!list || !list.keys || list.keys.length === 0) return;
    await Promise.all(list.keys.map(async (key) => {
      try {
        const result = await storage.get(key, true);
        if (!result) return;
        apply(key, JSON.parse(result.value));
      } catch (e) { /* skip unreadable key */ }
    }));
  } catch (e) {
    console.error(`Could not load keys under ${prefix}:`, e);
  }
}

// Build the effective fixtures/knockoutScores by layering seed -> permanent -> editable.
async function loadLayeredState(baseFixtures) {
  const fixtures = baseFixtures.map(m => ({ ...m }));
  const knockoutScores = {};

  // Layer 1: permanent fixture saves
  await loadKeyed('permanent:score:', (key, value) => {
    const idx = fixtures.findIndex(m => permanentFixtureKey(m) === key);
    if (idx !== -1) { fixtures[idx].hs = value.hs; fixtures[idx].aw = value.aw; }
  });
  // Layer 2: editable fixture saves (override permanent if both exist)
  await loadKeyed('score:', (key, value) => {
    const idx = fixtures.findIndex(m => fixtureKey(m) === key);
    if (idx !== -1) { fixtures[idx].hs = value.hs; fixtures[idx].aw = value.aw; }
  });
  // Layer 1: permanent knockout saves
  await loadKeyed('permanent:knockout:', (key, value) => {
    const matchId = key.replace('permanent:knockout:', '');
    knockoutScores[matchId] = value;
  });
  // Layer 2: editable knockout saves
  await loadKeyed('knockout:', (key, value) => {
    const matchId = key.replace('knockout:', '');
    knockoutScores[matchId] = value;
  });

  return { fixtures, knockoutScores };
}

// What the editable layer should reset BACK TO: seed data overlaid with
// permanent saves only (i.e. permanent saves survive a reset, nothing else does).
async function loadPermanentBaseline(baseFixtures) {
  const fixtures = baseFixtures.map(m => ({ ...m }));
  const knockoutScores = {};
  await loadKeyed('permanent:score:', (key, value) => {
    const idx = fixtures.findIndex(m => permanentFixtureKey(m) === key);
    if (idx !== -1) { fixtures[idx].hs = value.hs; fixtures[idx].aw = value.aw; }
  });
  await loadKeyed('permanent:knockout:', (key, value) => {
    const matchId = key.replace('permanent:knockout:', '');
    knockoutScores[matchId] = value;
  });
  return { fixtures, knockoutScores };
}

async function clearEditableLayer() {
  const [scoreList, knockoutList] = await Promise.all([
    storage.list('score:', true),
    storage.list('knockout:', true),
  ]);
  const keys = [
    ...((scoreList && scoreList.keys) || []),
    ...((knockoutList && knockoutList.keys) || []),
  ];
  const results = await Promise.allSettled(keys.map(key => storage.delete(key, true)));
  const failures = results.filter(r => r.status === 'rejected');
  if (failures.length > 0) {
    console.error(`${failures.length} of ${keys.length} editable-layer delete(s) failed:`, failures.map(f => f.reason));
    throw new Error(`Could not clear ${failures.length} saved result(s) — they may still show after reset.`);
  }
}

// Write the CURRENT effective fixtures/knockoutScores into the permanent
// tier (only the entries that actually have a score), and clear the
// editable tier so nothing is double-counted.
async function commitToPermanentLayer(fixtures, knockoutScores) {
  try {
    const fixtureWrites = fixtures
      .filter(m => m.hs !== null && m.hs !== undefined && m.aw !== null && m.aw !== undefined)
      .map(m => storage.set(permanentFixtureKey(m), JSON.stringify({ hs: m.hs, aw: m.aw }), true));
    const knockoutWrites = Object.entries(knockoutScores)
      .filter(([, v]) => v && v.hs !== null && v.hs !== undefined)
      .map(([matchId, v]) => storage.set(permanentKnockoutKey(matchId), JSON.stringify(v), true));
    // Use allSettled, not all -- one failed write shouldn't abort the rest
    // or leave the caller's promise hanging forever.
    const results = await Promise.allSettled([...fixtureWrites, ...knockoutWrites]);
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error(`${failures.length} permanent-save write(s) failed:`, failures.map(f => f.reason));
    }
    await clearEditableLayer();
    return { ok: failures.length === 0, failures: failures.length };
  } catch (e) {
    console.error('Could not commit permanent save:', e);
    return { ok: false, failures: -1 };
  }
}

// ============================================================
// MAIN APP
// ============================================================

function App() {
  const [activeTab, setActiveTab] = React.useState('predictor');
  const [fixtures, setFixtures] = React.useState(() => WC_FIXTURES.map(m => ({ ...m })));
  const [knockoutScores, setKnockoutScores] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState('idle');
  const [useLiveForm, setUseLiveForm] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    loadLayeredState(WC_FIXTURES).then((state) => {
      if (!cancelled) { setFixtures(state.fixtures); setKnockoutScores(state.knockoutScores); setLoaded(true); }
    });
    return () => { cancelled = true; };
  }, []);

  const tournamentBracket = React.useMemo(
    () => buildRealKnockoutBracket(fixtures, knockoutScores),
    [fixtures, knockoutScores]
  );
  const formState = React.useMemo(
    () => computeTournamentForm(fixtures, knockoutScores, tournamentBracket),
    [fixtures, knockoutScores, tournamentBracket]
  );

  const updateScore = (index, field, value) => {
    setFixtures(prev => {
      const next = [...prev];
      const parsed = value === '' ? null : Math.max(0, parseInt(value, 10) || 0);
      const updated = { ...next[index], [field]: parsed };
      next[index] = updated;
      setSaveStatus('saving');
      saveFixtureEdit(updated)
        .then(() => setSaveStatus('saved'))
        .catch(e => { console.error('Save failed:', e); setSaveStatus('error'); });
      return next;
    });
  };

  const updateKnockoutScore = (matchId, field, value) => {
    setKnockoutScores(prev => {
      const parsed = value === '' ? null : Math.max(0, parseInt(value, 10) || 0);
      const current = prev[matchId] || { hs: null, aw: null, pen: undefined };
      const updated = { ...current, [field]: parsed };
      const next = { ...prev, [matchId]: updated };
      setSaveStatus('saving');
      saveKnockoutEdit(matchId, updated)
        .then(() => setSaveStatus('saved'))
        .catch(e => { console.error('Save failed:', e); setSaveStatus('error'); });
      return next;
    });
  };

  const setKnockoutPenaltyWinner = (matchId, side) => {
    setKnockoutScores(prev => {
      const current = prev[matchId] || { hs: null, aw: null };
      const updated = { ...current, pen: side };
      const next = { ...prev, [matchId]: updated };
      setSaveStatus('saving');
      saveKnockoutEdit(matchId, updated)
        .then(() => setSaveStatus('saved'))
        .catch(e => { console.error('Save failed:', e); setSaveStatus('error'); });
      return next;
    });
  };

  // Reset clears only the editable layer; the visible state falls back to
  // seed data overlaid with whatever's been permanently saved (NOT all the
  // way back to the original 28 seeded results if permanent saves exist).
  const resetToActual = () => {
    setSaveStatus('saving');
    clearEditableLayer()
      .then(() => loadPermanentBaseline(WC_FIXTURES))
      .then(baseline => {
        setFixtures(baseline.fixtures);
        setKnockoutScores(baseline.knockoutScores);
        setSaveStatus('saved');
      })
      .catch(e => {
        console.error('Reset failed:', e);
        setSaveStatus('error');
      });
  };

  const savePermanently = () => {
    setSaveStatus('saving');
    return commitToPermanentLayer(fixtures, knockoutScores)
      .then(result => {
        setSaveStatus(result && result.ok ? 'saved' : 'error');
        return result;
      })
      .catch(e => {
        console.error('Save permanently failed:', e);
        setSaveStatus('error');
        return { ok: false };
      });
  };

  const playedCount = fixtures.filter(m => m.hs !== null && m.aw !== null).length;

  return (
    <div style={{
      fontFamily: FONT_DISPLAY, background: COLORS.bgSubtle, minHeight: '100%',
      padding: '24px 16px', boxSizing: 'border-box',
    }}>
      <style>{`@keyframes wc-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.inkFaint, fontWeight: 700, marginBottom: 4 }}>
              2026 World Cup model
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.ink }}>
              Match predictor & tournament simulator
            </div>
            <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 6 }}>
              Base ratings stay fixed; entered World Cup results can add a small tournament-results adjustment layer for future projections.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <FormModeToggle enabled={useLiveForm} onToggle={setUseLiveForm} />
            <SaveStatusBadge status={saveStatus} />
          </div>
        </div>

        <TabBar active={activeTab} onChange={setActiveTab} />

        {activeTab === 'predictor' && <MatchPredictorScreen formState={formState} useLiveForm={useLiveForm} />}
        {activeTab === 'results' && (
          <ResultsScreen
            fixtures={fixtures}
            updateScore={updateScore}
            playedCount={playedCount}
            onReset={resetToActual}
            onSavePermanently={savePermanently}
            knockoutScores={knockoutScores}
            updateKnockoutScore={updateKnockoutScore}
            setKnockoutPenaltyWinner={setKnockoutPenaltyWinner}
          />
        )}
        {activeTab === 'tables' && (
          <ChampionshipScreen
            fixtures={fixtures}
            playedCount={playedCount}
            knockoutScores={knockoutScores}
            formState={formState}
            useLiveForm={useLiveForm}
          />
        )}
        {activeTab === 'bracket' && (
          <BracketScreen
            fixtures={fixtures}
            playedCount={playedCount}
            knockoutScores={knockoutScores}
            formState={formState}
            useLiveForm={useLiveForm}
          />
        )}
      </div>

    </div>
  );
}

function SaveStatusBadge({ status }) {
  if (status === 'idle') return null;
  const label = status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Save failed — try again';
  const color = status === 'error' ? '#A32D2D' : COLORS.inkFaint;
  return (
    <span style={{
      fontSize: 11, color, fontFamily: FONT_MONO, flexShrink: 0, marginTop: 4,
      display: 'flex', alignItems: 'center', gap: 5, fontWeight: status === 'error' ? 700 : 400,
    }}>
      {status === 'saving' && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: COLORS.inkFaint,
          display: 'inline-block', animation: 'wc-pulse 1s ease-in-out infinite',
        }} />
      )}
      {status === 'error' && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#A32D2D', display: 'inline-block' }} />
      )}
      {label}
    </span>
  );
}

export default App;

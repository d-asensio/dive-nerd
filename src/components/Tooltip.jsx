import styled from 'styled-components';

export const Tooltip = styled.div`
  user-select: none;
  border-radius: 4px;
  padding: 20px;
  background-color: white;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;

  transform: translate(-50%, 100%);
  position: absolute;
  bottom: -16px;

  &::after {
    content: "";
    bottom: 100%;
	left: 50%;
	border: solid transparent;
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
	border-bottom-color: white;
	border-width: 5px;
	margin-left: -5px;
    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  }
`
function [deck] = shufflecards()
%
% Returns a shuffled deck of cards.
% 
deck = randperm( 52 ); 